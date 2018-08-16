export class NoTableOfFigureError extends Error {
    constructor() {
        super('Cannot build the table of figure. \n' +
            'Could not locate an element with `tof` class attached to it. \n' +
            'Please create an element with a `tof` class applied to it.');
    }
}
export class NoTableOfContentError extends Error {
    constructor() {
        super('Cannot build the table of content. \n' +
            'Could not locate an element with `toc` class attached to it. \n' +
            'Please create an element with a `toc` class applied to it.');
    }
}
