const expect = require("chai").expect;
const albums = require("../lib/data.js");

describe("Album Module", () => {
    it("returns requested album", () => {
      const result = albums.getItem("cleopatra");
      expect(result).to.deep.equal({title: "cleopatra", artist:"the lumineers", releasedate:2016});
    });
    
    it("fails w/ invalid album", () => {
      const result = albums.getItem("fake");
      expect(result).to.be.undefined;
    });
});

describe("Add Album", () => {
    it("adds a new album", () => {
        const result = albums.addItem({title: "higher love", artist:"kygo", releasedate:2019});
        expect(result.added).to.be.true;
    });

    it("fails to add an existing album", () => {
        const result = albums.addItem({title: "cleopatra", ;artist:"the lumineers", releasedate:2016});
        expect(result.added).to.be.false;
    });
});

describe("Delete Album", () => {
    it("deletes an album", () => {
        const result = albums.deleteItem("cleopatra");
        expect(result.deleted).to.be.true;
    });

    it("fails to delete a album", () => {
        const result = albums.deleteItem("fake");
        expect(result.deleted).to.be.false;
    });

});