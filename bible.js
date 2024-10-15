const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const builder = require('xmlbuilder');

// Connect to the rst.sqlite3 database file
const dbPath = path.join(__dirname, '', 'rst.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database: ', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

let bibleOBJ = [];

const getBooks = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM books`, (err, books) => {
            if (err) {
                reject(err);
            } else {
                resolve(books);
            }
        });
    });
};

const getVerses = (bookNumber) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM verses WHERE book_number = ?`, [bookNumber], (err, verses) => {
            if (err) {
                reject(err);
            } else {
                resolve(verses);
            }
        });
    });
};


init();

async function init() {
    const bible = {
        books: []
    }
    const books = await getBooks();

    for (let i = 0; i < books.length; i++) {
        const verses = await getVerses(books[i].book_number);
        const chapters = {

        }
        for (var item of verses) {
            if (!chapters[item.chapter]) {
                chapters[item.chapter] = [];
            }
            const trimPB = item.text.replace('<pb/>', '');
            const trimedStrongs = trimPB.replace(/<S>.*?<\/S>/g, "");
            const trimeAllTags = trimedStrongs.replace(/<.*?>/g, "");
            chapters[item.chapter].push(trimeAllTags);
        }
        bible.books.push({
            [books[i].long_name]: chapters
        });
    }

    console.log(bible.books.length);


    const xml = builder.create('XMLBIBLE', { encoding: 'UTF-8', version: '1.0', standalone: true })
        .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
        .att('biblename', 'Russian');


    // to xml
    for (let i = 0; i < bible.books.length; i++) {
        const book = bible.books[i];
        const bookName = Object.keys(book)[0];
        const bookChapters = book[bookName];
        const bibleBook = xml.ele('BIBLEBOOK', { bnumber: i + 1, bname: bookName });

        for (let chapter in bookChapters) {
            const chapterElement = bibleBook.ele('CHAPTER', { cnumber: chapter });
            const verses = bookChapters[chapter];
            for (let verse in verses) {
                chapterElement.ele('VERS', { vnumber: parseInt(verse)+1 }, verses[verse]);
            }
        }
    }

    const xmlString = xml.end({ pretty: true });

    const outputPath = path.join(__dirname, 'bible.xml');
    // Write the XML string to a file
    fs.writeFile(outputPath, xmlString, (err) => {
        if (err) {
            console.error('Error writing XML file: ', err.message);
        } else {
            console.log(`XML file saved successfully`);
        }
    });

}
 