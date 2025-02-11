import createError from 'http-errors';
import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import 'dotenv/config';

import indexRouter from './routes/pagesRoute.js';

// database connection

import getDb from './config/db.js';

const checkConnection = async () => {
    try {
        const db = await getDb(); // Get the db connection after the tunnel is established
        await db.query('SELECT 1');
        console.log('Connected to MySQL');
    } catch (err) {
        console.error('MySQL Connection Error:', err.message);
    }
};

checkConnection(); // Check the connection

const app = express();

// view engine setup
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('public'));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

export default app;
