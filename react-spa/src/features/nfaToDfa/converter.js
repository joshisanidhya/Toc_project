const EPSILON_ALIASES = new Set(['e', 'eps', 'epsilon', 'ε']);

const EMPTY_STATE = '∅';

function normalizeSymbol(rawSymbol) {
  const symbol = rawSymbol.trim();
  if (EPSILON_ALIASES.has(symbol.toLowerCase()) || symbol === 'ε') {
    return 'ε';
  }
  return symbol;
}

function parseCsv(raw) {
  return raw
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);
}

function setLabel(stateSet) {
  if (!stateSet || stateSet.size === 0) {
    return EMPTY_STATE;
  }
  return `{${[...stateSet].sort().join(',')}}`;
}

function ensureDeltaSlot(delta, state, symbol) {
  if (!delta[state]) {
    delta[state] = {};
  }
  if (!delta[state][symbol]) {
    delta[state][symbol] = new Set();
  }
}

export function parseNfaDefinition(formValues) {
  const states = parseCsv(formValues.states);
  const alphabetRaw = parseCsv(formValues.alphabet);
  const startState = formValues.startState.trim();
  const finalStates = parseCsv(formValues.finalStates);

  if (states.length === 0 || alphabetRaw.length === 0 || !startState || finalStates.length === 0) {
    throw new Error('All fields are required and must contain valid values.');
  }

  if (!states.includes(startState)) {
    throw new Error('Start state must be one of the declared states.');
  }

  const unknownFinal = finalStates.filter((state) => !states.includes(state));
  if (unknownFinal.length > 0) {
    throw new Error(`Final states contain unknown states: ${unknownFinal.join(', ')}`);
  }

  const normalizedAlphabet = [...new Set(alphabetRaw.map(normalizeSymbol))];
  const workAlphabet = normalizedAlphabet.filter((symbol) => symbol !== 'ε');

  if (workAlphabet.length === 0) {
    throw new Error('Alphabet must include at least one non-epsilon symbol.');
  }

  const delta = {};
  states.forEach((state) => {
    delta[state] = {};
  });

  const transitionLines = formValues.transitions
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (transitionLines.length === 0) {
    throw new Error('Please provide at least one transition rule.');
  }

  transitionLines.forEach((line) => {
    const [left, right] = line.split('=');
    if (!left || !right) {
      throw new Error(`Invalid transition format: "${line}". Use state,symbol=next1,next2`);
    }

    const [fromRaw, symbolRaw] = left.split(',');
    if (!fromRaw || !symbolRaw) {
      throw new Error(`Invalid transition left side: "${left}". Expected state,symbol`);
    }

    const from = fromRaw.trim();
    const symbol = normalizeSymbol(symbolRaw);
    const targets = parseCsv(right);

    if (!states.includes(from)) {
      throw new Error(`Transition references unknown state: ${from}`);
    }

    if (targets.length === 0) {
      throw new Error(`Transition has no target states: "${line}"`);
    }

    const unknownTargets = targets.filter((target) => !states.includes(target));
    if (unknownTargets.length > 0) {
      throw new Error(`Transition references unknown target states: ${unknownTargets.join(', ')}`);
    }

    ensureDeltaSlot(delta, from, symbol);
    targets.forEach((target) => {
      delta[from][symbol].add(target);
    });
  });

  return {
    states,
    alphabet: workAlphabet,
    delta,
    startState,
    finalStates,
  };
}

function epsilonClosure(initialStates, delta) {
  const closure = new Set(initialStates);
  const stack = [...initialStates];

  while (stack.length > 0) {
    const current = stack.pop();
    const epsilonTargets = delta[current]?.['ε'] ?? new Set();

    epsilonTargets.forEach((target) => {
      if (!closure.has(target)) {
        closure.add(target);
        stack.push(target);
      }
    });
  }

  return closure;
}

function move(stateSet, symbol, delta) {
  const reached = new Set();

  stateSet.forEach((state) => {
    const symbolTargets = delta[state]?.[symbol] ?? new Set();
    symbolTargets.forEach((target) => reached.add(target));
  });

  return reached;
}

export function convertNfaToDfa(nfa) {
  const startClosure = epsilonClosure(new Set([nfa.startState]), nfa.delta);
  const startLabel = setLabel(startClosure);

  const queue = [startClosure];
  const visited = new Set([startLabel]);
  const dfaStateMap = { [startLabel]: startClosure };
  const dfaTransitions = { [startLabel]: {} };
  const steps = [];

  let usesDeadState = false;

  while (queue.length > 0) {
    const currentSet = queue.shift();
    const currentLabel = setLabel(currentSet);

    if (!dfaTransitions[currentLabel]) {
      dfaTransitions[currentLabel] = {};
    }

    const detailRows = nfa.alphabet.map((symbol) => {
      const moved = move(currentSet, symbol, nfa.delta);
      const movedLabel = setLabel(moved);
      const closure = epsilonClosure(moved, nfa.delta);
      const closureLabel = setLabel(closure);
      let discovered = false;

      if (closureLabel === EMPTY_STATE) {
        usesDeadState = true;
      } else if (!visited.has(closureLabel)) {
        discovered = true;
        visited.add(closureLabel);
        dfaStateMap[closureLabel] = closure;
        dfaTransitions[closureLabel] = {};
        queue.push(closure);
      }

      dfaTransitions[currentLabel][symbol] = closureLabel;

      return {
        symbol,
        move: movedLabel,
        epsilonClosure: closureLabel,
        target: closureLabel,
        discovered,
      };
    });

    steps.push({
      stateLabel: currentLabel,
      details: detailRows,
    });
  }

  if (usesDeadState) {
    dfaStateMap[EMPTY_STATE] = new Set();
    dfaTransitions[EMPTY_STATE] = {};
    nfa.alphabet.forEach((symbol) => {
      dfaTransitions[EMPTY_STATE][symbol] = EMPTY_STATE;
    });
  }

  const dfaStates = Object.keys(dfaStateMap);
  const dfaFinalStates = dfaStates.filter((dfaState) => {
    const nfaSubset = dfaStateMap[dfaState] ?? new Set();
    return [...nfaSubset].some((nfaState) => nfa.finalStates.includes(nfaState));
  });

  return {
    alphabet: nfa.alphabet,
    startState: startLabel,
    states: dfaStates,
    finalStates: dfaFinalStates,
    transitionTable: dfaTransitions,
    steps,
  };
}

export function nfaExample() {
  return {
    states: 'q0, q1, q2, q3',
    alphabet: 'a, b, ε',
    transitions: 'q0,ε=q1\nq0,ε=q2\nq1,a=q1\nq1,b=q3\nq2,b=q2\nq2,a=q3',
    startState: 'q0',
    finalStates: 'q3',
  };
}
