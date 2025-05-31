import express from 'express';
import {engine} from 'express-handlebars';
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();


/*Configuración express */
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


/*Configuración de rutas */
import {authRouter} from './routes/auth.js';
import {devicesRouter} from './routes/devices.js';
import {fallsRouter} from './routes/falls.js';
import {homeRouter} from './routes/home.js';
import {notifyRouter} from './routes/notify.js';
import {profileRouter} from './routes/profile.js';

/*Configuración handlebars */
app.engine(
    'handlebars',
    handlebars.engine({
      runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
      },
    })
  );
app.set('view engine', 'handlebars');
app.set('views', './views');


app.get('/',async (req, res) => {
  console.log('hola')
    res.render('home')});

app.use('/auth', authRouter);
app.use('/devices', devicesRouter);
app.use('/falls', fallsRouter);
app.use('/home', homeRouter);
app.use('/notify', notifyRouter);
app.use('/profile', profileRouter);

app.listen(3000, () => console.log('Me quiero matar'));
