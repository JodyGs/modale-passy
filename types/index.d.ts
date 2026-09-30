import type { ReactElement, ReactNode } from 'react'

export interface ModalProps {
  /** Affiche ou masque la modale. */
  isOpen: boolean
  /** Appelée quand l'utilisateur demande la fermeture (bouton, Échap, clic sur l'overlay). */
  onClose: () => void
  /** Titre affiché en haut de la modale et utilisé comme nom accessible. */
  title?: ReactNode
  /** Contenu de la modale. */
  children?: ReactNode
  /** Ferme la modale avec la touche Échap. Par défaut : `true`. */
  closeOnEscape?: boolean
  /** Ferme la modale au clic sur l'overlay. Par défaut : `true`. */
  closeOnOverlayClick?: boolean
  /** Affiche le bouton de fermeture (croix). Par défaut : `true`. */
  showCloseButton?: boolean
  /** Libellé accessible du bouton de fermeture. Par défaut : `"Close"`. */
  closeLabel?: string
  /** Classe CSS supplémentaire appliquée au `<dialog>`. */
  className?: string
  /** Nom accessible de la modale quand aucun `title` n'est fourni. */
  ariaLabel?: string
}

export function Modal(props: ModalProps): ReactElement
