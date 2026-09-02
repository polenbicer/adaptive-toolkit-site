(() => {
  const PATHWAYS = {
    empty: {
      name: 'Use What Is Empty',
      description: 'Activate vacant shops, offices, public buildings and industrial sites before demanding new construction.',
      works: 'Early stage collectives, visible vacancy, testing demand and cultural actors with limited budgets.',
      models: ['Temporary cultural use', 'Meanwhile spaces', 'Short term occupancy agreement', 'Vacant to cultural matchmaking', 'Low cost artist workspace', 'Pop up exhibitions or rehearsal rooms'],
      risks: ['Short term instability', 'Legal uncertainty', 'Hidden renovation costs', 'Risk of culture led gentrification']
    },
    share: {
      name: 'Share What Already Exists',
      description: 'Open schools, libraries, halls and civic facilities when their existing timetable leaves capacity unused.',
      works: 'Municipal assets, community programmes, limited budgets and small or medium activities.',
      models: ['Evening use of schools', 'Weekend use of municipal halls', 'Cultural use of sports facilities', 'Shared use of libraries, markets and civic buildings', 'Co location with social, educational or community services'],
      risks: ['Low autonomy', 'Storage limitations', 'Missing technical infrastructure', 'Cultural use being treated as secondary']
    },
    move: {
      name: 'Move Culture Around',
      description: 'Bring cultural infrastructure to peripheral neighbourhoods and communities facing mobility barriers.',
      works: 'Young people, rural areas, low density areas and cities with uneven cultural provision.',
      models: ['Mobile cultural bus', 'Modular stage or pavilion', 'Temporary neighbourhood installation', 'Travelling workshop unit', 'Pop up cultural equipment kit', 'Seasonal outdoor cultural programme'],
      risks: ['Permit requirements', 'Weather dependency', 'Electricity and water access', 'Staff capacity']
    },
    memory: {
      name: 'Transform What Has Memory',
      description: 'Reuse heritage buildings and symbolic sites as cultural anchors without erasing their social memory.',
      works: 'Institutional partnerships, strong heritage identities and sustainability focused strategies.',
      models: ['Adaptive reuse', 'Cultural heritage hub', 'Creative production centre', 'Community memory space', 'Mixed cultural and social facility', 'Long term regeneration project'],
      risks: ['High renovation costs', 'Heritage restrictions', 'Accessibility limitations', 'Risk of culture led gentrification']
    },
    network: {
      name: 'Start Without a Building',
      description: 'Begin with programmes, partnerships and evidence when permanent space is not yet realistic.',
      works: 'Informal collectives, high rent cities and groups that need to build legitimacy first.',
      models: ['Programme first approach', 'Nomadic cultural collective', 'Partnerships with existing venues', 'Cultural mapping before space negotiation', 'Temporary events as evidence building', 'Digital or hybrid platform leading to physical space later'],
      risks: ['Lack of continuity', 'Weak visibility', 'Difficulty building a long term identity']
    }
  };

  const CONDITIONS = [
    { id: 'expensive', label: 'There are spaces, but they are too expensive', weights: { share: 4, network: 3, move: 1 }, reason: 'High spatial cost favours shared access and programme first strategies.' },
    { id: 'public-inaccessible', label: 'There are public buildings, but they are difficult to access', weights: { share: 4, empty: 2, network: 1 }, reason: 'Existing public assets make access negotiation more relevant than new construction.' },
    { id: 'energy-no-building', label: 'There is cultural energy, but no permanent infrastructure', weights: { network: 5, move: 3, share: 1 }, reason: 'Strong cultural energy without infrastructure favours programme first and mobile pathways.' },
    { id: 'heritage-costly', label: 'There are heritage buildings, but renovation is costly', weights: { memory: 5, share: 2, empty: 1 }, reason: 'Heritage assets create a strong reuse opportunity, while cost requires a supporting shared model.' },
    { id: 'peripheral-gap', label: 'Peripheral neighbourhoods have little cultural provision', weights: { move: 5, share: 2, network: 1 }, reason: 'Uneven cultural provision makes proximity and mobility central to the pathway.' },
    { id: 'weak-implementation', label: 'There are policies, but implementation is weak', weights: { network: 4, share: 2, empty: 1 }, reason: 'Weak implementation favours coalition building, evidence and smaller operational tests.' }
  ];

  const RESOURCES = [
    { id: 'artist-network', label: 'A strong artist network', weights: { network: 3, share: 2, empty: 1 }, reason: 'An established artist network can support coalition building and shared use.' },
    { id: 'municipal-support', label: 'Municipal support', weights: { empty: 3, share: 3, memory: 2 }, reason: 'Municipal support improves access to public assets and longer negotiations.' },
    { id: 'empty-buildings', label: 'Empty buildings', weights: { empty: 5, memory: 1 }, reason: 'Visible vacancy gives the empty space pathway a direct operational basis.' },
    { id: 'community-demand', label: 'Community demand', weights: { move: 3, network: 3, share: 2 }, reason: 'Demonstrated community demand supports local programming and evidence building.' },
    { id: 'public-facilities', label: 'Existing public facilities', weights: { share: 5, empty: 1 }, reason: 'Existing public facilities strongly support shared and time based access.' },
    { id: 'heritage-identity', label: 'Heritage identity', weights: { memory: 5, network: 1 }, reason: 'A strong heritage identity supports reuse connected to memory and place.' },
    { id: 'eu-funding', label: 'EU funding opportunities', weights: { memory: 3, empty: 2, move: 2 }, reason: 'External funding can support capital works, testing and mobile infrastructure.' },
    { id: 'university-partner', label: 'A university partner', weights: { network: 3, share: 2, empty: 1 }, reason: 'A university partner can contribute space, research and institutional legitimacy.' },
    { id: 'property-owner', label: 'A motivated property owner', weights: { empty: 5, memory: 2 }, reason: 'A motivated owner reduces the negotiation barrier for vacancy activation and reuse.' },
    { id: 'mobile-programme', label: 'A mobile programme', weights: { move: 5, network: 1 }, reason: 'Existing mobile capacity gives the distributed pathway a practical starting point.' },
    { id: 'local-knowledge', label: 'Local knowledge', weights: { network: 3, move: 2, share: 1 }, reason: 'Local knowledge supports mapping, coalition building and neighbourhood delivery.' }
  ];

  const CONSTRAINTS = [
    { id: 'high-rent', label: 'High rent', weights: { share: 4, network: 4, move: 2 }, reason: 'High rent weakens permanent occupancy and favours shared, mobile or programme first models.', risk: 'Affordability must remain visible in every property negotiation.' },
    { id: 'legal-clarity', label: 'Lack of legal clarity', weights: { network: 3, share: 2, move: 1 }, reason: 'Legal uncertainty favours reversible tests and coalition building before occupancy.', risk: 'Do not begin occupation without clarifying liability, permissions and duration.' },
    { id: 'no-funding', label: 'No long term funding', weights: { network: 4, share: 3, move: 1 }, reason: 'Limited long term funding favours lower commitment and shared pathways.', risk: 'A pilot should not create recurring costs without a credible continuation route.' },
    { id: 'weak-technical', label: 'Weak technical infrastructure', weights: { share: 3, network: 2 }, reason: 'Weak technical infrastructure makes equipped shared facilities more realistic.', risk: 'Technical upgrades, storage, power and accessibility need early costing.' },
    { id: 'limited-staff', label: 'Limited staff capacity', weights: { share: 3, network: 3, empty: 1 }, reason: 'Limited staff capacity favours partnerships and shared operating responsibility.', risk: 'Mobile and temporary models can still fail when coordination work is underestimated.' },
    { id: 'lack-trust', label: 'Lack of trust', weights: { network: 5, share: 1 }, reason: 'Low trust makes relationship building and small documented tests the first priority.', risk: 'A spatial agreement will remain fragile without a credible governance process.' },
    { id: 'poor-transport', label: 'Poor transport access', weights: { move: 4, share: 2 }, reason: 'Poor transport access favours bringing cultural provision closer to underserved groups.', risk: 'Mobility barriers should be assessed for both participants and programme delivery.' },
    { id: 'heritage-restrictions', label: 'Heritage restrictions', weights: { share: 3, network: 2, memory: 1 }, reason: 'Heritage restrictions require staged negotiation and may make shared use more realistic first.', risk: 'Heritage value does not remove accessibility, safety or operating requirements.' },
    { id: 'safety', label: 'Safety requirements', weights: { share: 3, network: 2, empty: 1 }, reason: 'Safety requirements favour equipped spaces and preparation before activation.', risk: 'Temporary use still requires credible safety, insurance and access arrangements.' },
    { id: 'political', label: 'Political uncertainty', weights: { network: 4, move: 2, share: 1 }, reason: 'Political uncertainty favours evidence, coalitions and reversible early actions.', risk: 'The pathway should not depend on one political sponsor or one electoral cycle.' }
  ];

  const SIGNALS = [
    { id: 'many-vacant', label: 'Many vacant buildings', weights: { empty: 5, memory: 2 }, reason: 'A visible stock of vacant buildings supports direct activation.' },
    { id: 'few-vacant', label: 'Few vacant buildings', weights: { share: 5, network: 2 }, reason: 'Limited vacancy increases the relevance of shared and programme first access.' },
    { id: 'high-rents', label: 'High rents', weights: { share: 4, network: 3, move: 2 }, reason: 'High rents favour models that reduce permanent occupancy costs.' },
    { id: 'strong-municipality', label: 'Strong municipal support', weights: { empty: 3, memory: 3, share: 2 }, reason: 'Strong municipal support improves the feasibility of public asset access and reuse.' },
    { id: 'weak-municipality', label: 'Weak municipal support', weights: { network: 5, move: 1 }, reason: 'Weak municipal support makes legitimacy and coalition building more important.' },
    { id: 'peripheral', label: 'Peripheral areas are underserved', weights: { move: 5, share: 2 }, reason: 'Peripheral gaps favour distributed and shared neighbourhood provision.' },
    { id: 'heritage', label: 'Strong heritage assets', weights: { memory: 5, share: 1 }, reason: 'Strong heritage assets support an adaptive reuse pathway.' },
    { id: 'low-participation', label: 'Low cultural participation', weights: { move: 4, network: 2 }, reason: 'Low participation calls for outreach, mobility and community co design.' },
    { id: 'artist-network', label: 'Strong artist network', weights: { share: 4, memory: 2, network: 1 }, reason: 'A strong artist network can sustain cooperative and shared space models.' },
    { id: 'limited-funding', label: 'Limited funding', weights: { network: 4, share: 3, move: 1 }, reason: 'Limited funding supports starting small, sharing or using a mobile low cost model.' },
    { id: 'stability', label: 'Need for long term stability', weights: { memory: 4, share: 3 }, reason: 'A need for stability favours longer partnerships and anchored reuse.' },
    { id: 'experimentation', label: 'Need for experimentation', weights: { empty: 4, move: 3, network: 1 }, reason: 'Experimentation favours temporary use, pop ups and mobile tests.' },
    { id: 'gentrification', label: 'Risk of gentrification', weights: { network: 3, share: 3 }, reason: 'Gentrification risk increases the importance of community governance and affordability safeguards.', risk: 'Community governance and affordability safeguards should be treated as core conditions.' },
    { id: 'lack-data', label: 'Lack of data', weights: { network: 3 }, reason: 'A lack of data makes mapping, surveys and documented pilots the appropriate first move.', risk: 'The result remains provisional until mapping and user evidence are available.' }
  ];

  const ACTIONS = [
    { id: 'recommend', label: 'Recommend an action from my result' },
    { id: 'map-spaces', label: 'Map existing cultural spaces' },
    { id: 'identify-vacancy', label: 'Identify vacant or underused spaces' },
    { id: 'talk-actors', label: 'Talk to cultural actors' },
    { id: 'talk-municipality', label: 'Talk to the municipality' },
    { id: 'contact-owners', label: 'Contact property owners' },
    { id: 'test-pilot', label: 'Test a one day pilot' },
    { id: 'share-space', label: 'Share space with another organisation' },
    { id: 'small-funding', label: 'Apply for small scale funding' },
    { id: 'coalition', label: 'Create a coalition' },
    { id: 'document-barriers', label: 'Document barriers' },
    { id: 'public-argument', label: 'Build a public argument' },
    { id: 'temporary-access', label: 'Negotiate temporary access' }
  ];

  const AUDIT_GROUPS = [
    {
      id: 'spatial', title: 'Spatial conditions', intro: 'Read the physical distribution and availability of space.',
      questions: [
        { id: 's1', text: 'Are there vacant or underused buildings?', yes: { empty: 4, memory: 1 }, no: { share: 2, network: 1 } },
        { id: 's2', text: 'Are cultural spaces concentrated in the city centre?', yes: { move: 3, share: 1 }, no: { share: 1 } },
        { id: 's3', text: 'Are peripheral areas underserved by cultural infrastructure?', yes: { move: 4, share: 2 }, no: {} },
        { id: 's4', text: 'Is temporary use legally and practically possible?', yes: { empty: 3, move: 1 }, no: { network: 2, share: 1 } },
        { id: 's5', text: 'Are spaces empty only at certain times of day or week?', yes: { share: 4 }, no: {} }
      ]
    },
    {
      id: 'institutional', title: 'Institutional conditions', intro: 'Examine rules, relationships and the capacity to negotiate access.',
      questions: [
        { id: 'i1', text: 'Is the municipality open to cultural collaboration?', yes: { empty: 2, share: 3, memory: 2 }, no: { network: 4 } },
        { id: 'i2', text: 'Is there a cultural department or one stop contact point?', yes: { share: 2, empty: 1 }, no: { network: 1 } },
        { id: 'i3', text: 'Are procurement, leasing or subsidy rules flexible?', yes: { empty: 3, share: 2 }, no: { network: 3 } },
        { id: 'i4', text: 'Can public buildings be used by external actors?', yes: { share: 4, empty: 1 }, no: { network: 2 } },
        { id: 'i5', text: 'Are there existing cultural strategies?', yes: { memory: 2, share: 1 }, no: { network: 1 } },
        { id: 'i6', text: 'Are there intermediaries who can negotiate between owners and cultural actors?', yes: { share: 3, empty: 2 }, no: { network: 2 } }
      ]
    },
    {
      id: 'financial', title: 'Financial conditions', intro: 'Test whether physical availability can become sustainable access.',
      questions: [
        { id: 'f1', text: 'Are rents relatively affordable?', yes: { empty: 2, memory: 1 }, no: { share: 3, network: 3, move: 1 } },
        { id: 'f2', text: 'Are grants available?', yes: { empty: 1, memory: 2, move: 1 }, no: { network: 2 } },
        { id: 'f3', text: 'Can spaces be subsidised?', yes: { empty: 3, share: 2 }, no: { network: 2 } },
        { id: 'f4', text: 'Can operating costs be shared?', yes: { share: 4 }, no: { network: 1 } },
        { id: 'f5', text: 'Is philanthropic, EU, municipal or private support available?', yes: { memory: 2, empty: 2, move: 1 }, no: { network: 2, share: 1 } },
        { id: 'f6', text: 'Can cultural actors generate some income without compromising accessibility?', yes: { share: 2, network: 2 }, no: { share: 1 } }
      ]
    },
    {
      id: 'social', title: 'Social and cultural conditions', intro: 'Identify unmet need, trust, exclusion and displacement risk.',
      questions: [
        { id: 'c1', text: 'Is there a clearly identified community need for cultural space?', yes: { move: 3, network: 3, share: 1 }, no: { network: 1 } },
        { id: 'c2', text: 'Are artists lacking production space?', yes: { empty: 3, share: 3 }, no: {} },
        { id: 'c3', text: 'Are residents lacking accessible cultural venues?', yes: { move: 3, share: 2 }, no: {} },
        { id: 'c4', text: 'Are young people, migrant communities, older people, disabled users or informal groups underserved?', yes: { move: 4, network: 2, share: 1 }, no: {} },
        { id: 'c5', text: 'Is there trust between institutions and cultural actors?', yes: { share: 3, memory: 1 }, no: { network: 4 } },
        { id: 'c6', text: 'Are communities at risk of displacement?', yes: { network: 3, share: 2 }, no: {}, risk: 'Displacement risk requires community governance and affordability safeguards.' }
      ]
    },
    {
      id: 'environmental', title: 'Environmental conditions', intro: 'Assess reuse, energy, mobility and material pressure.',
      questions: [
        { id: 'e1', text: 'Can existing buildings be reused?', yes: { memory: 4, empty: 3 }, no: { move: 2, network: 1 } },
        { id: 'e2', text: 'Are there significant climate or energy constraints?', yes: { share: 2, network: 1 }, no: { memory: 1 } },
        { id: 'e3', text: 'Are candidate buildings poorly insulated?', yes: { share: 2, network: 1 }, no: { memory: 1, empty: 1 } },
        { id: 'e4', text: 'Is public transport access strong?', yes: { share: 2, memory: 1 }, no: { move: 3 } },
        { id: 'e5', text: 'Can circular materials or shared resources be used?', yes: { share: 3, memory: 2 }, no: {} },
        { id: 'e6', text: 'Would the project reduce environmental pressure compared with new construction?', yes: { memory: 3, empty: 2, share: 1 }, no: { move: 1, network: 1 } }
      ]
    }
  ];

  const PATHWAY_ORDER = ['empty', 'share', 'move', 'memory', 'network'];

  function renderPathwayPage() {
    const pathwayList = document.querySelector('[data-pathway-list]');
    if (!pathwayList) return;
    const detail = document.querySelector('[data-pathway-detail]');
    const description = document.querySelector('[data-pathway-description]');
    const works = document.querySelector('[data-pathway-works]');
    const watch = document.querySelector('[data-pathway-watch]');
    const models = document.querySelector('[data-pathway-models]');
    const name = document.querySelector('[data-pathway-name]');
    pathwayList.querySelectorAll('[data-pathway]').forEach((button) => {
      button.addEventListener('click', () => {
        pathwayList.querySelectorAll('[data-pathway]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        const selected = PATHWAYS[button.dataset.pathway];
        name.textContent = selected.name;
        description.textContent = selected.description;
        works.textContent = selected.works;
        models.innerHTML = selected.models.map((model) => `<li>${model}</li>`).join('');
        watch.textContent = selected.risks.join(', ');
        button.insertAdjacentElement('afterend', detail);
      });
    });
  }

  function renderOptionList(container, items, name, type) {
    if (!container) return;
    container.innerHTML = items.map((item) => `
      <label class="${type === 'checkbox' ? 'check-card' : 'option-card'}">
        <input type="${type}" name="${name}" value="${item.id}">
        <span class="option-indicator" aria-hidden="true"></span>
        <span>${item.label}</span>
      </label>`).join('');
  }

  function createBuilder() {
    const app = document.querySelector('[data-builder-app]');
    if (!app) return;

    renderOptionList(app.querySelector('[data-condition-options]'), CONDITIONS, 'condition', 'radio');
    renderOptionList(app.querySelector('[data-resource-options]'), RESOURCES, 'resource', 'radio');
    renderOptionList(app.querySelector('[data-constraint-options]'), CONSTRAINTS, 'constraint', 'radio');
    renderOptionList(app.querySelector('[data-signal-options]'), SIGNALS, 'signals', 'checkbox');
    renderOptionList(app.querySelector('[data-action-options]'), ACTIONS, 'action', 'radio');

    const recommendedAction = app.querySelector('input[name="action"][value="recommend"]');
    if (recommendedAction) recommendedAction.checked = true;

    const state = { mode: null, auditAnswers: {}, auditGroup: 0, result: null };
    const screens = Array.from(app.querySelectorAll('[data-screen]'));
    const alertBox = app.querySelector('[data-builder-alert]');
    const controls = app.querySelector('[data-wizard-controls]');
    const backButton = app.querySelector('[data-builder-back]');
    const nextButton = app.querySelector('[data-builder-next]');
    const resetButton = app.querySelector('[data-reset-builder]');
    const modeLabel = app.querySelector('[data-mode-label]');
    const progressLabel = document.querySelector('[data-progress-label]');
    const progressCount = document.querySelector('[data-progress-count]');
    const progressBar = document.querySelector('[data-progress-bar]');
    const progressItems = Array.from(document.querySelectorAll('[data-progress-steps] li'));
    const fullProgressItem = document.querySelector('[data-full-step]');
    const quickOrder = ['mode', 'context', 'condition', 'resource', 'constraint', 'signals', 'action', 'result'];
    const fullOrder = ['mode', 'context', 'condition', 'resource', 'constraint', 'signals', 'audit', 'action', 'result'];
    const labels = { mode: 'Choose a mode', context: 'Define context', condition: 'Main city condition', resource: 'Strongest resource', constraint: 'Biggest constraint', signals: 'Strategic signals', audit: 'City audit', action: 'First action', result: 'Pathway result' };
    let current = 0;

    const getOrder = () => state.mode === 'full' ? fullOrder : quickOrder;
    const getScreenName = () => getOrder()[current];
    const getChecked = (name) => app.querySelector(`input[name="${name}"]:checked`)?.value || null;
    const getCheckedMany = (name) => Array.from(app.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => input.value);

    function showAlert(message) {
      alertBox.textContent = message;
      alertBox.hidden = false;
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function clearAlert() {
      alertBox.hidden = true;
      alertBox.textContent = '';
    }

    function updateProgress() {
      const order = getOrder();
      const screen = getScreenName();
      progressLabel.textContent = labels[screen];
      progressCount.textContent = `${String(current + 1).padStart(2, '0')} / ${String(order.length).padStart(2, '0')}`;
      progressBar.style.width = `${((current + 1) / order.length) * 100}%`;
      fullProgressItem.hidden = state.mode !== 'full';
      const visibleNames = state.mode === 'full' ? fullOrder : quickOrder;
      progressItems.forEach((item) => {
        const itemName = item.dataset.fullStep !== undefined ? 'audit' : item.textContent.trim().toLowerCase().replace('city condition', 'condition').replace('resources', 'resource').replace('constraints', 'constraint');
        const index = visibleNames.findIndex((name) => labels[name].toLowerCase().includes(itemName) || name === itemName);
        item.classList.toggle('is-current', index === current);
        item.classList.toggle('is-complete', index >= 0 && index < current);
      });
    }

    function updateScreen() {
      clearAlert();
      const name = getScreenName();
      screens.forEach((screen) => {
        const active = screen.dataset.screen === name;
        screen.hidden = !active;
        screen.classList.toggle('is-active', active);
      });
      modeLabel.textContent = state.mode ? `${state.mode === 'full' ? 'Full city diagnostic' : 'Quick pathway'}, ${labels[name]}` : 'Start';
      controls.hidden = name === 'mode' || name === 'result';
      resetButton.hidden = name === 'mode';
      backButton.hidden = current === 0;
      nextButton.innerHTML = name === 'action' ? 'Calculate pathway <span>→</span>' : 'Continue <span>→</span>';
      nextButton.hidden = name === 'audit' && state.auditGroup < AUDIT_GROUPS.length - 1;
      if (name === 'audit') renderAuditGroup();
      if (name === 'result') renderResult();
      updateProgress();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function validateScreen(name) {
      if (name === 'context' && !app.querySelector('[data-city-name]').value.trim()) {
        showAlert('Enter a city before continuing.'); return false;
      }
      if (name === 'condition' && !getChecked('condition')) { showAlert('Choose one main spatial condition.'); return false; }
      if (name === 'resource' && !getChecked('resource')) { showAlert('Choose the strongest resource currently available.'); return false; }
      if (name === 'constraint' && !getChecked('constraint')) { showAlert('Choose the biggest current constraint.'); return false; }
      if (name === 'audit') {
        const missing = AUDIT_GROUPS.flatMap((group) => group.questions).filter((question) => !state.auditAnswers[question.id]);
        if (missing.length) { showAlert(`Answer every city audit question. ${missing.length} answers are still missing. Choose Not sure when evidence is unavailable.`); return false; }
      }
      if (name === 'action' && !getChecked('action')) { showAlert('Choose a first action or ask the tool to recommend one.'); return false; }
      return true;
    }

    function renderAuditGroup() {
      const group = AUDIT_GROUPS[state.auditGroup];
      app.querySelector('[data-audit-group-title]').textContent = group.title;
      app.querySelector('[data-audit-group-intro]').textContent = group.intro;
      app.querySelector('[data-audit-group-count]').textContent = `${state.auditGroup + 1} / ${AUDIT_GROUPS.length}`;
      const list = app.querySelector('[data-audit-questions]');
      list.innerHTML = group.questions.map((question, index) => `
        <div class="audit-question">
          <span class="audit-question-index">${String(index + 1).padStart(2, '0')}</span>
          <p>${question.text}</p>
          <div class="answer-switch" role="radiogroup" aria-label="${question.text}">
            ${['yes', 'no', 'unsure'].map((answer) => `<label><input type="radio" name="audit-${question.id}" value="${answer}" ${state.auditAnswers[question.id] === answer ? 'checked' : ''}><span>${answer === 'unsure' ? 'Not sure' : answer[0].toUpperCase() + answer.slice(1)}</span></label>`).join('')}
          </div>
        </div>`).join('');
      list.querySelectorAll('input').forEach((input) => input.addEventListener('change', () => { state.auditAnswers[input.name.replace('audit-', '')] = input.value; }));
      app.querySelector('[data-audit-previous]').disabled = state.auditGroup === 0;
      app.querySelector('[data-audit-next]').hidden = state.auditGroup === AUDIT_GROUPS.length - 1;
      nextButton.hidden = state.auditGroup !== AUDIT_GROUPS.length - 1;
    }

    function calculateResult() {
      const scores = Object.fromEntries(PATHWAY_ORDER.map((key) => [key, 1]));
      const factors = [];
      const dynamicRisks = [];
      const addRule = (rule, answerLabel) => {
        if (!rule) return;
        Object.entries(rule.weights || {}).forEach(([key, value]) => { scores[key] += value; });
        const impact = Math.max(0, ...Object.values(rule.weights || {}));
        if (rule.reason) factors.push({ text: rule.reason, impact, answer: answerLabel || rule.label });
        if (rule.risk) dynamicRisks.push(rule.risk);
      };

      const condition = CONDITIONS.find((item) => item.id === getChecked('condition'));
      const resource = RESOURCES.find((item) => item.id === getChecked('resource'));
      const constraint = CONSTRAINTS.find((item) => item.id === getChecked('constraint'));
      addRule(condition, condition?.label);
      addRule(resource, resource?.label);
      addRule(constraint, constraint?.label);
      getCheckedMany('signals').forEach((id) => addRule(SIGNALS.find((item) => item.id === id)));

      if (state.mode === 'full') {
        AUDIT_GROUPS.forEach((group) => group.questions.forEach((question) => {
          const answer = state.auditAnswers[question.id];
          const weights = answer === 'yes' ? question.yes : answer === 'no' ? question.no : {};
          Object.entries(weights || {}).forEach(([key, value]) => { scores[key] += value; });
          const impact = Math.max(0, ...Object.values(weights || {}));
          if (impact >= 3) factors.push({ text: `${group.title}: ${question.text} Answer, ${answer}.`, impact, answer: question.text });
          if (answer === 'yes' && question.risk) dynamicRisks.push(question.risk);
        }));
      }

      const ranking = PATHWAY_ORDER.map((key) => ({ key, raw: scores[key] })).sort((a, b) => b.raw - a.raw);
      const max = ranking[0].raw;
      ranking.forEach((item) => { item.percent = Math.max(8, Math.round((item.raw / max) * 100)); });
      const selectedAction = getChecked('action');
      const actionDefaults = { empty: 'identify-vacancy', share: 'share-space', move: 'test-pilot', memory: 'map-spaces', network: 'coalition' };
      const actionId = selectedAction === 'recommend' ? actionDefaults[ranking[0].key] : selectedAction;
      const action = ACTIONS.find((item) => item.id === actionId);
      const topReasons = factors.sort((a, b) => b.impact - a.impact).filter((factor, index, array) => array.findIndex((item) => item.text === factor.text) === index).slice(0, 5);
      const closeResult = ranking[0].percent - ranking[1].percent <= 7;
      return {
        city: app.querySelector('[data-city-name]').value.trim(),
        project: app.querySelector('[data-project-name]').value.trim(),
        actor: app.querySelector('[data-actor-type]').value,
        mode: state.mode,
        condition, resource, constraint,
        signals: getCheckedMany('signals').map((id) => SIGNALS.find((item) => item.id === id)),
        ranking, primary: ranking[0].key, supporting: ranking[1].key,
        reasons: topReasons.map((item) => item.text),
        risks: [...PATHWAYS[ranking[0].key].risks, ...dynamicRisks].filter((risk, index, array) => array.indexOf(risk) === index).slice(0, 6),
        action, closeResult,
        auditAnswered: Object.keys(state.auditAnswers).length
      };
    }

    function renderResult() {
      state.result = calculateResult();
      const result = state.result;
      const primary = PATHWAYS[result.primary];
      const supporting = PATHWAYS[result.supporting];
      app.querySelector('[data-result-primary]').textContent = primary.name;
      app.querySelector('[data-result-summary]').textContent = result.closeResult
        ? `${result.city} shows two closely matched pathways. ${primary.name} currently ranks first, while ${supporting.name} remains a credible alternative.`
        : `${result.city} shows the strongest current fit with ${primary.name}. ${supporting.name} can support the route where the primary model meets practical limits.`;
      app.querySelector('[data-result-supporting]').textContent = supporting.name;
      app.querySelector('[data-supporting-copy]').textContent = supporting.description;
      app.querySelector('[data-result-reasons]').innerHTML = result.reasons.map((reason) => `<li>${reason}</li>`).join('');
      app.querySelector('[data-result-risks]').innerHTML = result.risks.map((risk) => `<li>${risk}</li>`).join('');
      app.querySelector('[data-result-models]').innerHTML = primary.models.map((model) => `<li>${model}</li>`).join('');
      app.querySelector('[data-result-action]').textContent = result.action.label;
      app.querySelector('[data-result-action-copy]').textContent = `Treat this as the first realistic move for ${result.city}. Document who participates, what blocks progress and what institutional support is required.`;
      app.querySelector('[data-score-list]').innerHTML = result.ranking.map((item) => `
        <div class="score-row"><span>${PATHWAYS[item.key].name}</span><span class="score-bar" aria-hidden="true"><span style="width:${item.percent}%"></span></span><strong>${item.percent}</strong></div>`).join('');
      app.querySelector('[data-result-method]').textContent = `${result.mode === 'full' ? `The full diagnostic included ${result.auditAnswered} city reading answers.` : 'The quick pathway used the core toolkit variables.'} The calculation also included ${result.signals.length} matrix signals, one main condition, one strongest resource and one biggest constraint.`;
    }

    function pdfSafe(value) {
      return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/İ/g, 'I').replace(/[^\x20-\x7E]/g, '');
    }

    function downloadReport() {
      const result = state.result;
      if (!result) return;
      if (!window.jspdf?.jsPDF) { showAlert('The PDF generator could not load. Check the internet connection and try again.'); return; }
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      const blue = [23, 70, 209];
      const orange = [255, 87, 56];
      const ink = [17, 17, 17];
      const paper = [243, 240, 232];
      let y = 22;

      const newPageIfNeeded = (needed) => {
        if (y + needed > 282) { doc.addPage(); y = 22; }
      };
      const sectionTitle = (title) => {
        newPageIfNeeded(18);
        doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...blue);
        doc.text(pdfSafe(title).toUpperCase(), 18, y); y += 8;
      };
      const paragraph = (text, size = 11, indent = 0) => {
        doc.setFont('helvetica', 'normal'); doc.setFontSize(size); doc.setTextColor(...ink);
        const lines = doc.splitTextToSize(pdfSafe(text), 174 - indent);
        newPageIfNeeded(lines.length * 5 + 4);
        doc.text(lines, 18 + indent, y); y += lines.length * 5 + 4;
      };
      const bulletList = (items) => items.forEach((item) => paragraph(`* ${item}`, 10, 3));

      doc.setFillColor(...blue); doc.rect(0, 0, 210, 70, 'F');
      doc.setTextColor(...paper); doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.text('ADAPTIVE TOOLKIT', 18, 18);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(27);
      const titleLines = doc.splitTextToSize(pdfSafe(PATHWAYS[result.primary].name), 145);
      doc.text(titleLines, 18, 36);
      doc.setFillColor(...orange); doc.rect(176, 14, 18, 42, 'F');
      y = 84;

      sectionTitle('Context');
      paragraph(`${result.city}${result.project ? `, ${result.project}` : ''}. Perspective, ${result.actor}. Diagnostic mode, ${result.mode === 'full' ? 'Full city diagnostic' : 'Quick pathway'}.`);
      sectionTitle('Pathway result');
      paragraph(`Primary pathway, ${PATHWAYS[result.primary].name}.`);
      paragraph(`Supporting pathway, ${PATHWAYS[result.supporting].name}.`);
      paragraph(result.closeResult ? 'The two highest pathways are closely matched. Treat the result as a structured comparison, not a definitive answer.' : PATHWAYS[result.primary].description);

      sectionTitle('Inputs');
      bulletList([`Main condition, ${result.condition.label}`, `Strongest resource, ${result.resource.label}`, `Biggest constraint, ${result.constraint.label}`, ...result.signals.map((signal) => `Strategic signal, ${signal.label}`)]);
      sectionTitle('Why this route');
      bulletList(result.reasons);
      sectionTitle('Possible models');
      bulletList(PATHWAYS[result.primary].models);
      sectionTitle('Watch closely');
      bulletList(result.risks);
      sectionTitle('First realistic action');
      paragraph(result.action.label);
      paragraph('Document who participates, who cannot access the activity, what blocks progress, what support is required and what should change institutionally.');

      sectionTitle('Comparative fit');
      result.ranking.forEach((item) => {
        newPageIfNeeded(10);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(...ink); doc.text(pdfSafe(PATHWAYS[item.key].name), 18, y);
        doc.setFillColor(220, 218, 210); doc.rect(92, y - 3, 78, 3, 'F');
        doc.setFillColor(item.key === result.primary ? orange[0] : blue[0], item.key === result.primary ? orange[1] : blue[1], item.key === result.primary ? orange[2] : blue[2]);
        doc.rect(92, y - 3, 78 * item.percent / 100, 3, 'F');
        doc.text(String(item.percent), 178, y); y += 9;
      });

      sectionTitle('Methodology note');
      paragraph('This report applies a transparent rule based score derived from the Adaptive Toolkit pathway matrix, local conditions, works well for statements and caution statements. It does not use artificial intelligence and it does not replace political judgement, community deliberation or legal assessment.', 9);
      paragraph(`Generated ${new Date().toLocaleDateString('en-GB')}.`, 8);
      const fileBase = pdfSafe(result.city).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'city';
      doc.save(`${fileBase}-cultural-space-pathway.pdf`);
    }

    app.querySelectorAll('[data-mode]').forEach((button) => button.addEventListener('click', () => {
      state.mode = button.dataset.mode;
      current = 1;
      updateScreen();
    }));
    nextButton.addEventListener('click', () => {
      const name = getScreenName();
      if (!validateScreen(name)) return;
      current = Math.min(current + 1, getOrder().length - 1);
      updateScreen();
    });
    backButton.addEventListener('click', () => { current = Math.max(0, current - 1); updateScreen(); });
    resetButton.addEventListener('click', () => {
      app.querySelectorAll('input').forEach((input) => { input.checked = false; });
      app.querySelectorAll('input[type="text"]').forEach((input) => { input.value = ''; });
      state.mode = null; state.auditAnswers = {}; state.auditGroup = 0; state.result = null; current = 0;
      const recommend = app.querySelector('input[name="action"][value="recommend"]'); if (recommend) recommend.checked = true;
      updateScreen();
    });
    app.querySelector('[data-audit-previous]').addEventListener('click', () => { state.auditGroup = Math.max(0, state.auditGroup - 1); renderAuditGroup(); });
    app.querySelector('[data-audit-next]').addEventListener('click', () => {
      const group = AUDIT_GROUPS[state.auditGroup];
      const missing = group.questions.filter((question) => !state.auditAnswers[question.id]);
      if (missing.length) { showAlert(`Answer all ${group.title.toLowerCase()} questions before continuing. Choose Not sure when evidence is unavailable.`); return; }
      clearAlert(); state.auditGroup = Math.min(AUDIT_GROUPS.length - 1, state.auditGroup + 1); renderAuditGroup();
    });
    app.querySelector('[data-revise-builder]').addEventListener('click', () => { current = getOrder().indexOf('signals'); updateScreen(); });
    app.querySelector('[data-download-report]').addEventListener('click', downloadReport);
    updateScreen();
  }

  function setupFieldNotes() {
    const printButton = document.querySelector('[data-print-notes]');
    if (printButton) printButton.addEventListener('click', () => window.print());
  }

  renderPathwayPage();
  createBuilder();
  setupFieldNotes();
})();

(() => {
  const rotatingWord = document.querySelector('[data-rotating-word]');

  if (!rotatingWord || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const words = [
    'blueprint',
    'monument',
    'commodity',
    'privilege',
    'prescription'
  ];

  let currentWord = 0;

  window.setInterval(() => {
    rotatingWord.classList.add('is-changing');

    window.setTimeout(() => {
      currentWord = (currentWord + 1) % words.length;
      rotatingWord.textContent = words[currentWord];
      rotatingWord.classList.remove('is-changing');
    }, 180);
  }, 2000);
})();
