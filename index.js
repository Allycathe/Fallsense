import express from 'express';
import {engine} from 'express-handlebars';
import Handlebars from 'handlebars';
import cookieParser from 'cookie-parser';

/*Configuración express */
const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

/*Configuración handlebars */
app.engine(
    'handlebars',
     Handlebars.engine({
        runtimeoptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        }
     })
);

app.get('/',async (req, res) => {
    res.render('Inicio')});

app.listen(3000, () => console.log('Me quiero matar'));
