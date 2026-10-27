# PAP’S Mali — 100 % Tailwind CSS

13 pages HTML : accueil, entreprise, boissons, soda, actualités, galerie, contact et 6 pages parfums.

**Aucun fichier CSS, aucune balise `<style>`, aucun attribut `style`** : toute la présentation est réalisée avec les classes utilitaires Tailwind CSS, y compris les variantes arbitraires (`bg-[#...]`, `text-[clamp(...)]`, `blur-[...]`).

`assets/js/main.js` gère le menu mobile, les icônes Lucide et les animations GSAP ; aucun style CSS n'est injecté manuellement.

## Utilisation
Ouvrez `index.html` avec une connexion Internet (Tailwind CDN, Lucide, GSAP et Google Fonts). Pour une mise en production, compilez Tailwind avec Tailwind CLI afin de générer un CSS optimisé ; la version livrée utilise le CDN de développement conformément à la demande de ne fournir aucun CSS séparé.

Images originales dans `assets/images/`. Le logo typographique est provisoire. Aucun prix ni format non confirmé n'a été inventé.


## Architecture partagée (header et footer)

Le site utilise désormais un header et un footer centralisés, chargés dans toutes les pages HTML :
- `components/header.html` : navigation principale et menu mobile ;
- `components/footer.html` : pied de page commun ;
- `assets/js/layout.js` : chargement des composants, liens adaptés aux pages de `produits/`, menu mobile et année automatique ;
- `assets/css/layout.css` : styles spécifiques de navigation.

Les contenus propres à chaque page, les feuilles de style, scripts, images, fichiers ZIP et autres ressources existants ont été conservés. Les pages doivent être ouvertes via un serveur HTTP (par exemple l’extension Live Server de VS Code ou un hébergement web), car le navigateur bloque généralement `fetch()` sur les fichiers ouverts directement en `file://`.
