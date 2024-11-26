const toggleView = (toView) => {
    const mainSectionContent = document.querySelector('section.main-content');
    const statsSectionContent = document.querySelector('section.stats-content');
    let show;
    let hide;

    if (toView === 'stats') {
        hide = mainSectionContent;
        show = statsSectionContent;
    } else {
        hide = statsSectionContent;
        show = mainSectionContent;
    }

    hide.classList.add('display-none-transition');
    show.classList.add('display-show-transition');

    setTimeout(() => {
        show.classList.remove('display-none');

        hide.classList.add('display-none');
        hide.classList.remove('display-none-transition');
    }, 250);

    setTimeout(() => {
        show.classList.remove('display-show-transition');
    }, 500);
}

export { toggleView };