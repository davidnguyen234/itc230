let albums = [
    {title:'faith', artist: 'bon iver', releasedate:2019 },
    {title:'cleopatra', artist: 'the lumineers', releasedate:2016 },
    {title:'coexist', artist: 'the xx', releasedate:2012},
    {title:'loyal', artist: 'odesza', releasedate:2018},
    {title:'lungs', artist: 'florence + the machine', releasedate:2009}
   ];

const getAll = () =>
{
    return albums;
};

const getItem = (title) =>
{ 
    return albums.find((album) => {
        return album.title == title;
    });
};

const deleteItem = (title) => {
    let foundIndex = albums.findIndex((album) => {
        return album.title === title;
    });
    if (foundIndex > -1) {
    albums.splice(foundIndex, 1);
        return {deleted: true, count: albums.length};
    }else {
        return {deleted: false, count: albums.length};
    }
};

const addItem = (newItem) => {
    if (getItem(newItem.title)) {
        return {added: false, count : albums.length};
    } else {
        albums.push(newItem);
        return {added: true, count: albums.length};
    }
}



//console.log(getAll(albums));
//console.log(getItem('Cleopatra'));
//console.log(deleteItem(2));

module.exports = { getAll, getItem, deleteItem, addItem}