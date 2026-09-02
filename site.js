(() => {
  const pathwayData = {
    empty: {
      name: 'Use What Is Empty',
      description: 'Activate vacant shops, offices, public buildings and industrial sites before demanding new construction.',
      works: 'Early stage collectives, visible vacancy, testing demand and cultural actors with limited budgets.',
      watch: 'Short term instability, hidden renovation costs, legal uncertainty and gentrification risk.'
    },
    share: {
      name: 'Share What Already Exists',
      description: 'Open schools, libraries, halls and civic facilities when their existing timetable leaves capacity unused.',
      works: 'Municipal assets, community programmes, limited budgets and small or medium activities.',
      watch: 'Low autonomy, storage limits, missing technical infrastructure and culture being treated as secondary.'
    },
    move: {
      name: 'Move Culture Around',
      description: 'Bring cultural infrastructure to peripheral neighbourhoods and communities facing mobility barriers.',
      works: 'Young people, rural areas, low density areas and cities with uneven cultural provision.',
      watch: 'Permits, weather dependency, access to utilities and the operating capacity needed to stay mobile.'
    },
    memory: {
      name: 'Transform What Has Memory',
      description: 'Reuse heritage buildings and symbolic sites as cultural anchors without erasing their social memory.',
      works: 'Institutional partnerships, strong heritage identities and sustainability focused strategies.',
      watch: 'Renovation costs, accessibility, heritage restrictions and culture led displacement.'
    },
    network: {
      name: 'Start Without a Building',
      description: 'Begin with programmes, partnerships and evidence when permanent space is not yet realistic.',
      works: 'Informal collectives, high rent cities and groups that need to build legitimacy first.',
      watch: 'Weak visibility, discontinuity and the difficulty of forming a lasting public identity.'
    }
  };

  const pathwayList = document.querySelector('[data-pathway-list]');
  if (pathwayList) {
    const detail = document.querySelector('[data-pathway-detail]');
    const description = document.querySelector('[data-pathway-description]');
    const works = document.querySelector('[data-pathway-works]');
    const watch = document.querySelector('[data-pathway-watch]');
    const name = document.querySelector('[data-pathway-name]');

    pathwayList.querySelectorAll('[data-pathway]').forEach((button) => {
      button.addEventListener('click', () => {
        pathwayList.querySelectorAll('[data-pathway]').forEach((item) => {
          item.setAttribute('aria-pressed', String(item === button));
        });
        const selected = pathwayData[button.dataset.pathway];
        name.textContent = selected.name;
        description.textContent = selected.description;
        works.textContent = selected.works;
        watch.textContent = selected.watch;
        button.insertAdjacentElement('afterend', detail);
      });
    });
  }

  const condition = document.querySelector('[data-builder-condition]');
  if (condition) {
    const routes = {
      empty: ['Use What Is Empty', 'Transform What Has Memory'],
      share: ['Share What Already Exists', 'Start Without a Building'],
      move: ['Move Culture Around', 'Share What Already Exists'],
      memory: ['Transform What Has Memory', 'Share What Already Exists'],
      network: ['Start Without a Building', 'Mapping and coalition building']
    };
    const primary = document.querySelector('[data-builder-primary]');
    const supporting = document.querySelector('[data-builder-supporting]');
    const updateResult = () => {
      const result = routes[condition.value];
      primary.textContent = result[0];
      supporting.textContent = result[1];
    };
    condition.addEventListener('change', updateResult);
    updateResult();
  }

  const printButton = document.querySelector('[data-print-notes]');
  if (printButton) {
    printButton.addEventListener('click', () => window.print());
  }
})();
