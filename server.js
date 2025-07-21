const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuration du moteur de template EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour servir les fichiers statiques (CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware personnalisé pour vérifier les heures ouvrables
const checkBusinessHours = (req, res, next) => {
    const now = new Date();
    const day = now.getDay(); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi
    const hour = now.getHours();
    
    // Vérifier si c'est un jour ouvrable (lundi à vendredi)
    const isWeekday = day >= 1 && day <= 5;
    // Vérifier si c'est dans les heures ouvrables (9h à 17h)
    const isBusinessHour = hour >= 9 && hour < 17;
    
    if (!isWeekday || !isBusinessHour) {
        const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const currentDay = dayNames[day];
        const currentTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        
        return res.status(503).render('closed', {
            currentDay,
            currentTime,
            title: 'Service Fermé'
        });
    }
    
    next();
};

// Appliquer le middleware à toutes les routes
app.use(checkBusinessHours);

// Routes
app.get('/', (req, res) => {
    res.render('home', {
        title: 'Accueil',
        currentPage: 'home'
    });
});

app.get('/services', (req, res) => {
    res.render('services', {
        title: 'Nos Services',
        currentPage: 'services'
    });
});

app.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contactez-nous',
        currentPage: 'contact'
    });
});

// Route pour gérer les pages non trouvées
app.use((req, res) => {
    res.status(404).render('404', {
        title: 'Page Non Trouvée'
    });
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Accédez à l'application : http://localhost:${PORT}`);
});

module.exports = app;