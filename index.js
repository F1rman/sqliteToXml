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
        books: [

        ]
    }
    const books = await getBooks();

    books.forEach(async book => {
        const verses = await getVerses(book.book_number);

        // each verses have a chapter index
        verses.forEach(verse => {
            const chapters = [];

            // get all chapters with verses

            if (!chapters.includes(verse.chapter)) {
                chapters.push({
                    [verse.chapter]: verse.text
                });
            }
        });


        bible.books.push({
            [book.long_name]: {
                chapters: chapters
            }
        });
        console.log(bible.books[0]);
    });



    // books.forEach(async book => {


    //     const verses = await getVerses(book.book_number);
    //     const chapters = [];
    //     verses.forEach(verse => {
    //         if (!chapters.includes(verse.chapter)) {
    //             chapters.push(verse.text);
    //         }
    //     }
    //     );




    // });



}



// // Use db.all to fetch all books at once
// db.all(`SELECT * FROM books`, async (err, books) => {
//     if (err) {
//         console.error('Error querying books: ', err.message);
//     } else {
//         let bibleBook;
//         // const xml = builder.create('XMLBIBLE', { encoding: 'UTF-8', version: '1.0', standalone: true })
//         //     .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
//         //     .att('biblename', 'Russian');

//         // books.forEach((book, i) => {
//         //     booksArray.push(book);
//         //     bibleBook = xml.ele('BIBLEBOOK', { bnumber: i + 1, bname: book.long_name })
//         // });
//         books.forEach((book, i) => {
//             bibleOBJ.push(book);
//         });

//         bibleOBJ.forEach(async book => {
//             // finad all versec for the book


//             const getVerses = (bookNumber) => {
//                 return new Promise((resolve, reject) => {
//                     db.all(`SELECT * FROM verses WHERE book_number = ?`, [bookNumber], (err, verses) => {
//                         if (err) {
//                             reject(err);
//                         } else {
//                             resolve(verses);
//                         }
//                     });
//                 });
//             };

//             const verces = await getVerses(book.book_number)

//             console.log(verces)

//         });

//         // booksArray.forEach(book => {

//         //     const book_number = book.book_number;


//         //     bibleBook.ele('CHAPTER', { cnumber: 1 });

//         // });

//         // const xmlString = xml.end({ pretty: true });
//         // const outputPath = path.join(__dirname, 'bible.xml');

//         // // Write the XML string to a file
//         // fs.writeFile(outputPath, xmlString, (err) => {
//         //     if (err) {
//         //         console.error('Error writing XML file: ', err.message);
//         //     } else {
//         //         console.log(`XML file saved successfully at ${outputPath}`);
//         //     }
//         // });
//     }

//     // Close the database connection
//     db.close((err) => {
//         if (err) {
//             console.error('Error closing database: ', err.message);
//         } else {
//             console.log('Closed the database connection.');
//         }
//     });
// });


// db.serialize(() => {
//     const xml = builder.create('XMLBIBLE', { encoding: 'UTF-8', version: '1.0', standalone: true })
//         .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
//         .att('biblename', 'Russian');

//     // Query books

//     let bibleBook;
//     var i = 0;


//     db.each(`SELECT * FROM books`, (err, book) => {
//         www.push(book);
//             if (err) {
//             console.error('Error querying books: ', err.message);
//         } else {
//             i++;
//             bibleBook = xml.ele('BIBLEBOOK', { bnumber: i, bname: book.long_name });
//         }
//     });

//     console.log(www)
//     www.forEach(book => {
//         db.each(`SELECT * FROM verses WHERE book_number = ${book.book_number}`, (err, verse) => {
//             // console.log(`Processing verse: ${verse}`);
//             // if (err) {
//             //     console.error('Error querying verse: ', err.message);
//             // } else {
//             //     const chapterElement = bibleBook.ele('CHAPTER', { cnumber: verse.chapter });
//             //     chapterElement.ele('VERS', { vnumber: verse.vnumber }, verse.text);
//             // }
//         });
//     }
//     );

//     // db.each(`SELECT * FROM verses WHERE book_number = ${book.book_number}`, (err, verse) => {
//     //     console.log(`Processing verse: ${verse}`);
//     //     // if (err) {
//     //     //     console.error('Error querying verse: ', err.message);
//     //     // } else {
//     //     //     const chapterElement = bibleBook.ele('CHAPTER', { cnumber: verse.chapter });
//     //     //     chapterElement.ele('VERS', { vnumber: verse.vnumber }, verse.text);
//     //     // }
//     // });


//     // db.each(`SELECT * FROM verses WHERE book_number = 10`, (err, verse) => {
//     //     console.log(`Processing verse: ${verse}`);
//     //     if (err) {
//     //         // console.error('Error querying verse: ', err.message);
//     //     } else {
//     //         const chapterElement = bibleBook.ele('CHAPTER', { cnumber: verse.chapter });

//     //         // // Query verses for the current chapter
//     //         // db.each(`SELECT * FROM verses WHERE chapter_id = ${chapter.id}`, (err, verse) => {
//     //         //     if (err) {
//     //         //         console.error('Error querying verses: ', err.message);
//     //         //     } else {
//     //         //         console.log(`Processing verse: ${verse.vnumber}`);
//     //         //         chapterElement.ele('VERS', { vnumber: verse.vnumber }, verse.text);
//     //         //     }
//     //         // });
//     //     }
//     // });


//     // Once all queries are done, write the XML content to a file
//     db.close((err) => {
//         if (err) {
//             console.error('Error closing database: ', err.message);
//         } else {
//             console.log('Finished processing, now saving to file...');
//             const xmlString = xml.end({ pretty: true });
//             const outputPath = path.join(__dirname, 'bible.xml');

//             // Write the XML string to a file
//             fs.writeFile(outputPath, xmlString, (err) => {
//                 if (err) {
//                     console.error('Error writing XML file: ', err.message);
//                 } else {
//                     console.log(`XML file saved successfully at ${outputPath}`);
//                 }
//             });
//         }
//     });
// });
