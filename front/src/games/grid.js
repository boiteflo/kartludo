class manager {

    static setup(width, height) {
        const grid = {};
        grid.width = width;
        grid.height = height;

        grid.card = {height: height / 5};
        grid.card.width = grid.card.height * 107 / 150;

        return grid;
    }
}


export default manager;
