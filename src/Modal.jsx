import { useEffect, useId, useRef } from 'react'
import './Modal.css'

/**
 * Fenêtre modale accessible, conversion React du plugin jQuery `jquery-modal`.
 *
 * Elle s'appuie sur l'élément natif `<dialog>` : le navigateur gère le piège de focus,
 * la touche Échap, le rendu au-dessus du reste de la page et le retour du focus à la fermeture.
 * Le composant est contrôlé : le parent décide de l'ouverture via `isOpen` et réagit à `onClose`.
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

  // Le contenu remplit tout le <dialog> : un clic dont la cible est le <dialog> lui-même vise l'overlay.
  const handleClick = (event) => {
    if (closeOnOverlayClick && event.target === dialogRef.current) onClose?.()
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
