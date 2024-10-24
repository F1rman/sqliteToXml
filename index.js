const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const builder = require('xmlbuilder');

const billeBooksNames = [
    'Genesis',
    'Exodus',
    'Leviticus',
    'Numbers',
    'Deuteronomy',
    'Joshua',
    'Judges',
    'Ruth',
    '1 Samuel',
    '2 Samuel',
    '1 Kings',
    '2 Kings',
    '1 Chronicles',
    '2 Chronicles',
    'Ezra',
    'Nehemiah',
    'Esther',
    'Job',
    'Psalms',
    'Proverbs',
    'Ecclesiastes',
    'Song of Songs',
    'Isaiah',
    'Jeremiah',
    'Lamentations',
    'Ezekiel',
    'Daniel',
    'Hosea',
    'Joel',
    'Amos',
    'Obadiah',
    'Jonah',
    'Micah',
    'Nahum',
    'Habakkuk',
    'Zephaniah',
    'Haggai',
    'Zechariah',
    'Malachi',
    'Matthew',
    'Mark',
    'Luke',
    'John',
    'Acts',
    'Romans',
    '1 Corinthians',
    '2 Corinthians',
    'Galatians',
    'Ephesians',
    'Philippians',
    'Colossians',
    '1 Thessalonians',
    '2 Thessalonians',
    '1 Timothy',
    '2 Timothy',
    'Titus',
    'Philemon',
    'Hebrews',
    'James',
    '1 Peter',
    '2 Peter',
    '1 John',
    '2 John',
    '3 John',
    'Jude',
    'Revelation'
];

// Connect to the rst.sqlite3 database file
const dbPath = path.join(__dirname, '', 'christian_hymns.db');
const db2Path = path.join(__dirname, '', 'psalter.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database: ', err.message);
    } else {
        console.log('Connected to the database.');
    }
});
const db2 = new sqlite3.Database(db2Path, (err) => {
    if (err) {
        console.error('Error opening database: ', err.message);
    } else {
        console.log('Connected to the database.');
    }
});


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
const getTable2 = (table) => {
    return new Promise((resolve, reject) => {
        db2.all(`SELECT * FROM ${table}`, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const getById = (table, row, id) => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM ${table} WHERE ${row} = ?`, [id], (err, verses) => {
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
    const initDB = [{
        book: 0,
        hymns:
            [
                // {
                //     title: title, // string
                //     subtitle: subtitle, // string
                //     psalm: 'psalm 1', // string
                //     hymnText: hymn_text, // string
                //     hymnAuthor: hymn_author, // string
                //     formatedHymnAuthor: hymn_author, // string

                //     hymnBook: hymn_book, // int 1
                //     bibleRef: [{
                //         book : 1, // int
                //         ref: '', // string
                //         sort: 1, // int
                //     }],
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
    },
    {
        book: 1,
        hymns: []
    }
    ];


    const hymns = await getTable('hymns');
    const authors = await getTable('authors');
    const categories = await getTable('categories');
    const subcategories = await getTable('subcategories');
    const references = await getTable('references2');
    const hymn_meters = await getTable('hymn_meters');
    const DBbible = await getTable('bible');
    const files = await getTable('files');
    const psalms = await getTable('psalms');

    for (let i = 0; i < hymns.length; i++) {
        const category = categories.find(cat => cat.id === hymns[i].category);
        const hymn = hymns[i];
        const hymnObj = {
            id: hymn.id,
            title: hymn.title,

            subtitle: hymn.subtitle,
            hymnText: hymn.content.replace(/<.*?>/g, ""),
            hymnAuthor: hymn.author.replace(/<.*?>/g, ""),
            hymnBook: 0,


            category: {
                id: category.id,
                name: category.category_name,
            },



        }

        const listAuthors = authors.find(author => {
            const ids = author.hymns.split(',').map(id => {
                return parseInt(id);
            });
            for (let i = 0; i < ids.length; i++) {
                if (ids[i] == hymn.id) {
                    return true;
                }
            }

        });
        if (listAuthors !== undefined) {
            hymnObj['formatedHymnAuthor'] = listAuthors.author;
        }


        const psalm = psalms.find(p => p.hymn_id === hymn.id);
        if (psalm !== undefined) {
            hymnObj['psalm'] = psalm.name.replace('Psalm ', '')
        }
        const subcategory = subcategories.find(subcat => subcat.id === hymns[i].subcategory);
        if (subcategory !== undefined && subcategory.category === category.id) {
            hymnObj['subcategory'] = {
                id: subcategory.id,
                name: subcategory.name,
                categoryId: subcategory.category,
            };
        }

        // DBbible.book 
        // billeBooksNames
        // find all references for this hymn
        hymnObj['bibleRef'] = [];
        const hymnRefs = references.filter(ref => ref.hymn === hymns[i].id);
        hymnRefs.forEach(ref => {
            const bookName = DBbible[ref.slink - 1].book;
            const indexOfCorrectBook = billeBooksNames.indexOf(bookName);
            if (indexOfCorrectBook === -1) {
                console.log('book not found', bookName);
                return;
            }
            if (hymnObj['bibleRef'] === undefined) {
                hymnObj['bibleRef'] = [
                    {
                        book: indexOfCorrectBook + 1,
                        ref: ref.description,
                    }
                ];
            }
            else {
                hymnObj['bibleRef'].push({
                    book: indexOfCorrectBook + 1,
                    ref: ref.description,
                });
            }

        });



        // {
        //     book: indexOfCorrectBook + 1,
        //     ref: bibleRef.description,
        // };



        const hymnMeter = hymn_meters.find(meter => {
            const ids = meter.hymn_ids.split(',').map(id => {
                return parseInt(id);
            });
            for (let i = 0; i < ids.length; i++) {
                if (ids[i] == hymn.id) {
                    return true;
                }
            }

        });
        // if (hymn.id == 67) {
        //     console.log(hymnMeter)
        // }
        if (hymnMeter !== undefined) {
            hymnObj['hymnMeter'] = {
                title: hymnMeter.hymn_title,
                img: hymnMeter.hymn_meter_src.replace('.png', ''),
                id: hymnMeter.id,
                meter: hymnMeter.meter,
            };
        }

        const availableTunes = files.filter(file => file.hymn_id === hymn.id);
        if (availableTunes.length > 0) {
            hymnObj['availableTunes'] = availableTunes.map(tune => {
                return {
                    id: tune.id,
                    name: tune.name.trim(),
                    midiUrl: tune.midi_src?.replace('data/midi/', '').replace('.mid', ''),
                    mp3Url: tune.mp3_src?.replace('data/mp3/', '').replace('.mp3', ''),
                    isPremium: tune.access == 1 ? true : false,
                    isDownloading: false,
                    isDownloaded: false,
                    pitch: 0,
                    tempo: 120,
                }
            }
            );
        }


        initDB[0].hymns.push(hymnObj);



    }



    const hymns2 = await getTable2('hymns');
    console.log(hymns2)


    for (let i = 0; i < hymns2.length; i++) {

        const hymn = hymns2[i];
        const hymnObj = {
            id: hymn.id,
            title: hymn.title,
            subtitle: hymn.subtitle,
            hymnText: hymn.content.replace(/<.*?>/g, ""),
            hymnBook: 2,
            category: {
                id: 1,
                name: 'Psalter',
            },
            availableTunes: [

            ],
            bibleRef: [],
        }


        initDB[1].hymns.push(hymnObj);
    }


    const outputPath = path.join(__dirname, 'init_db.json');
    fs.writeFile(outputPath, JSON.stringify(initDB, null, 2), (err) => {
        if (err) {
            console.error('Error writing JSON file: ', err.message);
        } else {
            console.log('JSON file saved successfully');
        }
    });



}
