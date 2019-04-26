const SearchCommands = {
  allByName: (unqfy, args) => {
    const result = unqfy.searchByName(args);

    console.log(result);
  }
};

module.exports = SearchCommands;
