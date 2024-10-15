const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const builder = require('xmlbuilder');

// Connect to the rst.sqlite3 database file
const dbPath = path.join(__dirname, '', 'christian_hymns.db');
console.log(dbPath)
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database: ', err.message);
    } else {
        console.log('Connected to the database.');
    }
});
console.log(db)

let bibleOBJ = [];

const getTable = (table) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM ${table}`, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

// // const getVerses = (bookNumber) => {
// //     return new Promise((resolve, reject) => {
// //         db.all(`SELECT * FROM verses WHERE book_number = ?`, [bookNumber], (err, verses) => {
// //             if (err) {
// //                 reject(err);
// //             } else {
// //                 resolve(verses);
// //             }
// //         });
// //     });
// // };


init();

async function init() {
    const initDB = [
        // {
        //     title: title, // string
        //     subtitle: subtitle, // string
        //     hymnText: hymn_text, // string
        //     hymnAuthor: hymn_author, // string
        //     hymnBook: hymn_book, // int 1
        //     bibleRef: {
        //         book : 1, // int
        //         ref: '', // string
        //     },
        //     hymnMeter: {
        //         title: title, // string
        //         img: img, // string
        //         id: id, // int
        //         meter: meter, // string
        //     },
        //     category: {
        //         id: id,  // int
        //         name: name, // string
        //     },
        //     subcategory: {
        //         id: id, // int
        //         name: name, // string
        //         categoryId: category_id, // int
        //     },
        //     availableTunes: [
        //         {
        //             id: id, // int
        //             name: name, // string
        //             midiUrl: midi_url, // string
        //             mp3Url: mp3_url, // string
        //             isPremium: is_premium, // boolean
        //             isDownloading: is_downloading, // boolean
        //             isDownloaded: is_downloaded, // boolean
        //             pitch: pitch, // string
        //             tempo: tempo, // string
        //         }
        //     ],
        // }
    ]


    const hymns = await getTable('hymns');
    const categories = await getTable('categories');
    const subcategories = await getTable('subcategories');
    const references = await getTable('references');

    // const authors = await getTable('authors');

    for (let i = 0; i < hymns.length; i++) {
        const category = categories.find(cat => cat.id === hymns[i].category);
        const hymn = hymns[i];
        const hymnObj = {
            title: hymn.title,
            subtitle: hymn.subtitle,
            hymnText: hymn.content,
            hymnAuthor: hymn.author,
            hymnBook: 1,
            // bibleRef: {
            //     book: hymn.bibleRef.book,
            //     ref: hymn.bibleRef.ref,
            // },
            // hymnMeter: {
            //     title: hymn.hymnMeter.title,
            //     img: hymn.hymnMeter.img,
            //     id: hymn.hymnMeter.id,
            //     meter: hymn.hymnMeter.meter,
            // },
            category: {
                id: category.id,
                name: category.category_name,
            },

            // availableTunes: hymn.availableTunes,


        }
        const subcategory = subcategories.find(subcat => subcat.id === hymns[i].subcategory);
        if (subcategory !== undefined) {
            hymnObj['subcategory'] = {
                id: subcategory.id,
                name: subcategory.name,
                categoryId: subcategory.category,
            };
        }
        console.log(references)
        // const bibleRef = references.find(e => e.hymn === hymns[i].id);
        // if (bibleRef !== undefined) {
        //     hymnObj['bibleRef'] = {
        //         book: 1,
        //         ref: bibleRef.description,
        //     };
        // }
        // initDB.push(hymnObj);

    }
    // console.log(initDB)


    //     // const books = await getBooks();

    //     // for (let i = 0; i < books.length; i++) {
    //     //     const verses = await getVerses(books[i].book_number);
    //     //     const chapters = {

    //     //     }
    //     //     for (var item of verses) {
    //     //         if (!chapters[item.chapter]) {
    //     //             chapters[item.chapter] = [];
    //     //         }
    //     //         const trimPB = item.text.replace('<pb/>', '');
    //     //         const trimedStrongs = trimPB.replace(/<S>.*?<\/S>/g, "");
    //     //         const trimeAllTags = trimedStrongs.replace(/<.*?>/g, "");
    //     //         chapters[item.chapter].push(trimeAllTags);
    //     //     }
    //     //     bible.books.push({
    //     //         [books[i].long_name]: chapters
    //     //     });
    //     // }

    //     // console.log(bible.books.length);


    //     const xml = builder.create('XMLBIBLE', { encoding: 'UTF-8', version: '1.0', standalone: true })
    //         .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')


    //     // const books = await getBooks();


    //     // // to xml
    //     // for (let i = 0; i < bible.books.length; i++) {
    //     //     const book = bible.books[i];
    //     //     const bookName = Object.keys(book)[0];
    //     //     const bookChapters = book[bookName];
    //     //     const bibleBook = xml.ele('BIBLEBOOK', { bnumber: i + 1, bname: bookName });

    //     //     for (let chapter in bookChapters) {
    //     //         const chapterElement = bibleBook.ele('CHAPTER', { cnumber: chapter });
    //     //         const verses = bookChapters[chapter];
    //     //         for (let verse in verses) {
    //     //             chapterElement.ele('VERS', { vnumber: parseInt(verse)+1 }, verses[verse]);
    //     //         }
    //     //     }
    //     // }

    //     // const xmlString = xml.end({ pretty: true });

    //     // const outputPath = path.join(__dirname, 'bible.xml');
    //     // // Write the XML string to a file
    //     // fs.writeFile(outputPath, xmlString, (err) => {
    //     //     if (err) {
    //     //         console.error('Error writing XML file: ', err.message);
    //     //     } else {
    //     //         console.log(`XML file saved successfully`);
    //     //     }
    //     // });

}
