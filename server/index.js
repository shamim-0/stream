const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const pool = require('./dbConfig');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 5000;
const secretKey = '2293173AF2BEE3D63D8EFA39C553A2293173AF2BEE3D63D8EFA39C553A';

const vtoken = crypto.randomBytes(10).toString('hex');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });




app.use(cors());
app.use(bodyParser.json());
app.use(express.static('uploads'));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const verifyToken = (req, res, next) => {
    const token = req.query.token;
    if (!token) {
        return res.status(403).json({ message: 'No token provided.' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token.' });
        }
        next();
    });
};


// Upload video file and convert to HLS
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    console.log(req.body.folder)

    const inputFilePath = path.join(__dirname, 'uploads', req.file.filename);
    const outputDir = path.join(__dirname, 'uploads', 'hls', `${Date.now()}`);
    const outputFilePath = path.join(outputDir, 'index.m3u8');

    // Create output directory if it doesn't exist
    fs.mkdirSync(outputDir, { recursive: true });

    ffmpeg(inputFilePath)
        .outputOptions([
            '-codec: copy',
            '-start_number 0',
            '-hls_time 10',
            '-hls_list_size 0',
            '-f hls'
        ])
        .output(outputFilePath)
        .on('end', async () => {
            console.log('File converted to HLS format');

            // Delete the original file
            fs.unlink(inputFilePath, (err) => {
                if (err) {
                    console.error('Error deleting original file:', err);
                } else {
                    console.log('Original file deleted');
                }
            });

            // Insert stream data into database
            const streamData = {
                token: vtoken,
                stream_link: `/uploads/hls/${path.basename(outputDir)}/index.m3u8`,
                title: req.body.title,
                folder: req.body.folder,
                stream_id: path.basename(outputDir),
                status: 1
            };

            try {
                const sql = 'INSERT INTO streams (token, stream_link, title, folder, stream_id, status) VALUES (?, ?, ?, ?, ?, ?)';
                const values = [streamData.token, streamData.stream_link, streamData.title, streamData.folder, streamData.stream_id, streamData.status];
                await pool.query(sql, values);

                res.status(200).json({
                    message: 'File uploaded and converted to HLS format successfully.',
                    m3u8Link: streamData.stream_link
                });
            } catch (error) {
                console.error('Error inserting stream data into database:', error);
                res.status(500).send('Error inserting stream data into database.');
            }
        })
        .on('error', (err) => {
            console.error('Error converting file:', err);
            res.status(500).send('Error converting file.');
        })
        .run();
});


// Assuming `pool` is your MySQL connection pool
app.get('/streams/:folder', async (req, res) => {
    const folderName = req.params.folder;
    try {
        const [rows] = await pool.query('SELECT * FROM streams WHERE folder = ?', [folderName]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No streams found for the specified folder' });
        }
        res.status(200).json({
            message: `Streams for folder: ${folderName}`,
            streams: rows
        });
    } catch (error) {
        console.error('Error retrieving streams:', error);
        res.status(500).send('Error retrieving streams from the database.');
    }
});




app.get('/uploads/hls/:dir/:file', async (req, res) => {
    const [stream] = await pool.query('SELECT status FROM streams WHERE stream_id = ?', [req.params.dir]);
    const filePath = path.join(__dirname, 'uploads', 'hls', req.params.dir, req.params.file);

    console.log(stream[0].status)

    if(stream[0].status){
        res.sendFile(filePath);
    }else{
       res.send('Deactive')
    }
});



app.patch('/streams/:id/toggle', async (req, res) => {
    const { id } = req.params;

    console.log(id)
    try {
        const [stream] = await pool.query('SELECT status FROM streams WHERE id = ?', [id]);
        if (stream.length === 0) {
            return res.status(404).json({ message: 'Stream not found' });
        }
        const newStatus = !stream[0].status;
        console.log(newStatus)
        await pool.query('UPDATE streams SET status = ? WHERE id = ?', [newStatus, id]);

        res.json({ status: newStatus });
    } catch (error) {
        console.error('Error updating stream status:', error);
        res.status(500).json({ message: 'Server error' });
    }
});



app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            const user = rows[0];
            if (password == user.password) {
                const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });
                res.status(200).json({ token });
            } else {
                res.status(401).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/validateToken', (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        jwt.verify(token, secretKey);
        res.json({ valid: true });
    } catch (error) {
        res.json({ valid: false });
    }
});





// category api 

// Endpoint to create a new category
app.post('/api/categories', async (req, res) => {
    const { name } = req.body;
    try {
        const sql = 'INSERT INTO categories (name) VALUES (?)';
        await pool.query(sql, [name]);
        res.status(201).json({ message: 'Category created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// Endpoint to retrieve all categories
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categories');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Endpoint to update a category
app.put('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const sql = 'UPDATE categories SET name = ? WHERE id = ?';
        await pool.query(sql, [name, id]);
        res.json({ message: 'Category updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update category' });
    }
});

// Endpoint to delete a category
app.delete('/api/categories/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const sql = 'DELETE FROM categories WHERE id = ?';
        await pool.query(sql, [id]);
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});


app.delete('/streams-delete/:id/:streamID', (req, res) => {
    const id = req.params.id;
    const filename = req.params.streamID;
    console.log(filename);

    const deleteQuery = 'DELETE FROM streams WHERE id = ?';

    pool.query(deleteQuery, [id], (error, results) => {
        if (error) {
            console.error('Error deleting stream:', error);
            return res.status(500).json({ error: 'Failed to delete stream' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Stream not found' });
        }

        res.status(204).send();
    })

    const folderPath = path.join(__dirname, 'uploads/hls/', filename);
    console.log(folderPath);
    fs.rm(folderPath, { recursive: true, force: true }, (err) => {
        if (err) {
            return res.status(500).send({ error: 'Failed to delete folder' });
        }
        res.send({ message: 'Data and folder deleted successfully' });
    });

});






app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
