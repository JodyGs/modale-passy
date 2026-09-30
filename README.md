# modale-passy

Composant React de fenêtre modale, léger et accessible, basé sur l'élément natif `<dialog>`.
C'est la conversion en React du plugin jQuery [`jquery-modal`](https://github.com/kylefox/jquery-modal).

- Focus piégé dans la modale, puis rendu à l'élément d'origine à la fermeture
- Fermeture par la touche Échap, le clic sur l'overlay ou le bouton (chacun désactivable)
- Défilement de la page bloqué tant que la modale est ouverte
- Aucune dépendance, environ 1,5 kB de JavaScript
- Personnalisable avec des variables CSS

## Prérequis

- React 18 ou plus récent
- Node.js 20 ou plus récent pour le développement

## Installation

```bash
npm install modale-passy
```

## Utilisation

```jsx
import { useState } from 'react'
import { Modal } from 'modale-passy'
import 'modale-passy/style.css'

export function App() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)}>
        Save
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} ariaLabel="Confirmation">
        Employee Created!
      </Modal>
    </>
  )
}
```

Le composant est contrôlé : c'est le parent qui décide de l'ouverture avec `isOpen`, et qui met son état à jour dans `onClose`.

## Props

| Prop                  | Type         | Défaut    | Description                                                                 |
| --------------------- | ------------ | --------- | --------------------------------------------------------------------------- |
| `isOpen`              | `boolean`    | requis    | Affiche ou masque la modale.                                                |
| `onClose`             | `() => void` | requis    | Appelée quand l'utilisateur demande la fermeture.                           |
| `title`               | `ReactNode`  | aucun     | Titre affiché en haut de la modale, utilisé comme nom accessible.           |
| `children`            | `ReactNode`  | aucun     | Contenu de la modale.                                                       |
| `closeOnEscape`       | `boolean`    | `true`    | Ferme la modale avec la touche Échap.                                       |
| `closeOnOverlayClick` | `boolean`    | `true`    | Ferme la modale au clic sur l'overlay.                                      |
| `showCloseButton`     | `boolean`    | `true`    | Affiche le bouton de fermeture (croix).                                     |
| `closeLabel`          | `string`     | `"Close"` | Libellé accessible du bouton de fermeture.                                  |
| `className`           | `string`     | `""`      | Classe CSS supplémentaire appliquée au `<dialog>`.                          |
| `ariaLabel`           | `string`     | aucun     | Nom accessible de la modale quand aucun `title` n'est fourni.               |

Équivalences avec `jquery-modal` : `escapeClose` → `closeOnEscape`, `clickClose` → `closeOnOverlayClick`,
`showClose` → `showCloseButton`, `closeText` → `closeLabel`, `modalClass` → `className`.

## Personnalisation

Les styles utilisent des variables CSS, à surcharger sur `.modale-passy` ou via `className` :

```css
.modale-passy {
  --modale-passy-width: 500px;
  --modale-passy-padding: 15px 30px;
  --modale-passy-radius: 8px;
  --modale-passy-background: #fff;
  --modale-passy-color: #1f2937;
  --modale-passy-overlay: rgba(0, 0, 0, 0.75);
  --modale-passy-shadow: 0 0 10px #000;
  --modale-passy-duration: 200ms;
}
```

## Développement

```bash
npm install
npm run dev     # page de démonstration (dossier demo/)
npm test        # tests unitaires (Vitest)
npm run lint
npm run build   # génère dist/ (ESM, CommonJS et CSS)
```

## Licence

MIT
