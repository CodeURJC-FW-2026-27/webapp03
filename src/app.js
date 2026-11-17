import express from 'express';
import mustacheExpress from 'mustache-express';
import bodyParser from 'body-parser';

import router from './router.js';
import './load_data.js';

const app = express();

app.set('view engine', 'html');
app.engine('html', mustacheExpress('./views/partials', '.html'));
app.set('views', './views');

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);
app.use('/assets/css', express.static('./public'));
app.use('/assets/js', express.static('./public'));
app.use('/uploads', express.static('./uploads'));
app.use(express.static('./public', { index: false }));

app.listen(3000, () => console.log('Web ready in http://localhost:3000/'));