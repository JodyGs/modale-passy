import { useEffect, useId, useRef } from 'react'
import './Modal.css'

/**
 * Fenêtre modale accessible, conversion React du plugin jQuery `jquery-modal`.
 *
 * Elle s'appuie sur l'élément natif `<dialog>` : le navigateur gère le piège de focus,
 * le rendu au-dessus du reste de la page et le retour du focus à la fermeture.
 * Le composant est contrôlé : le parent décide de l'ouverture via `isOpen` et réagit à `onClose`.
 *
 * @param {object} props
 * @param {boolean} props.isOpen Affiche la modale quand il vaut `true`, la masque sinon. C'est le parent
 *   qui tient cet état (par exemple avec `useState`).
 * @param {() => void} props.onClose Appelée quand l'utilisateur demande la fermeture (bouton, touche Échap
 *   ou clic sur l'overlay). Le parent doit y repasser `isOpen` à `false`.
 * @param {import('react').ReactNode} [props.title] Titre affiché en haut de la modale. Il sert aussi de
 *   nom accessible pour les lecteurs d'écran.
 * @param {import('react').ReactNode} [props.children] Contenu de la modale : texte ou éléments React.
 * @param {boolean} [props.closeOnEscape=true] Autorise la fermeture avec la touche Échap
 *   (équivalent de `escapeClose` dans jquery-modal).
 * @param {boolean} [props.closeOnOverlayClick=true] Autorise la fermeture au clic sur le fond assombri
 *   (équivalent de `clickClose`).
 * @param {boolean} [props.showCloseButton=true] Affiche le bouton de fermeture en croix (équivalent de `showClose`).
 * @param {string} [props.closeLabel='Close'] Libellé du bouton de fermeture lu par les lecteurs d'écran
 *   (équivalent de `closeText`).
 * @param {string} [props.className=''] Classe CSS ajoutée au `<dialog>`, pour personnaliser le style
 *   (équivalent de `modalClass`).
 * @param {string} [props.ariaLabel] Nom accessible de la modale, à fournir quand il n'y a pas de `title`.
 * @returns {import('react').ReactElement}
 *
 * @example
 * const [isOpen, setIsOpen] = useState(false)
 *
 * <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirmation">
 *   Employee Created!
 * </Modal>
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  showCloseButton = true,
  closeLabel = 'Close',
  className = '',
  ariaLabel,
}) {
  const dialogRef = useRef(null)
  const pressStartedOnOverlay = useRef(false)
  const pressEndedOnOverlay = useRef(false)
  const titleId = useId()

  // Synchronise l'état natif du <dialog> avec la prop `isOpen`.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen && !dialog.open) {
      dialog.showModal()
    } else if (!isOpen && dialog.open) {
      dialog.close()
    }
  }, [isOpen])

  // Touche Échap : gérée ici plutôt que par le navigateur, qui force la fermeture
  // au deuxième appui même si l'événement `cancel` est annulé.
  const handleKeyDown = (event) => {
    if (event.key !== 'Escape') return
    event.preventDefault()
    if (closeOnEscape) onClose?.()
  }

  // Autres demandes de fermeture du navigateur (ex. geste « retour » sur mobile).
  const handleCancel = (event) => {
    event.preventDefault()
    if (closeOnEscape) onClose?.()
  }

  // Fermeture déclenchée par le navigateur (ex. <form method="dialog">) : on prévient le parent.
  const handleNativeClose = () => {
    if (isOpen) onClose?.()
  }

  // Le contenu remplit tout le <dialog> : un événement dont la cible est le <dialog> lui-même vise l'overlay.
  const isOverlay = (target) => target === dialogRef.current

  const handleMouseDown = (event) => {
    pressStartedOnOverlay.current = isOverlay(event.target)
  }

  const handleMouseUp = (event) => {
    pressEndedOnOverlay.current = isOverlay(event.target)
  }

  // On ne ferme que si l'appui a commencé et fini sur l'overlay : une sélection de texte
  // qui déborde de la modale (ou qui y entre) ne doit pas la fermer.
  const handleClick = () => {
    const clickedOverlay = pressStartedOnOverlay.current && pressEndedOnOverlay.current
    pressStartedOnOverlay.current = false
    pressEndedOnOverlay.current = false
    if (closeOnOverlayClick && clickedOverlay) onClose?.()
  }

  const classNames = ['modale-passy', className].filter(Boolean).join(' ')

  return (
    <dialog
      ref={dialogRef}
      className={classNames}
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : ariaLabel}
      onKeyDown={handleKeyDown}
      onCancel={handleCancel}
      onClose={handleNativeClose}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
    >
      {isOpen && (
        <div className="modale-passy__content">
          {title && (
            <h2 id={titleId} className="modale-passy__title">
              {title}
            </h2>
          )}
          <div className="modale-passy__body">{children}</div>
          {showCloseButton && (
            <button type="button" className="modale-passy__close" aria-label={closeLabel} onClick={() => onClose?.()}>
              <span aria-hidden="true">&times;</span>
            </button>
          )}
        </div>
      )}
    </dialog>
  )
}
