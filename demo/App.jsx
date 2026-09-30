import { useState } from 'react'
import { Modal } from '../src/index.js'

/** Page de démonstration, utilisée uniquement en développement (non publiée sur npm). */
export function App() {
  const [openModal, setOpenModal] = useState(null)
  const close = () => setOpenModal(null)

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>modale-passy</h1>

      <p>
        <button type="button" onClick={() => setOpenModal('simple')}>
          Modale simple
        </button>{' '}
        <button type="button" onClick={() => setOpenModal('title')}>
          Avec titre
        </button>{' '}
        <button type="button" onClick={() => setOpenModal('strict')}>
          Fermeture par le bouton uniquement
        </button>
      </p>

      <Modal isOpen={openModal === 'simple'} onClose={close} ariaLabel="Confirmation">
        Employee Created!
      </Modal>

      <Modal isOpen={openModal === 'title'} onClose={close} title="Employé créé" closeLabel="Fermer">
        <p>La fiche a bien été enregistrée.</p>
        <button type="button" onClick={close}>
          OK
        </button>
      </Modal>

      <Modal
        isOpen={openModal === 'strict'}
        onClose={close}
        title="Action requise"
        closeOnEscape={false}
        closeOnOverlayClick={false}
      >
        <p>Ni Échap ni le clic sur l'overlay ne ferment cette modale.</p>
      </Modal>
    </main>
  )
}
