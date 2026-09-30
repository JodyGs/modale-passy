import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Modal } from './index.js'

afterEach(cleanup)

/** Simule un clic complet (appui, relâchement, clic) sur un élément. */
function press(element) {
  fireEvent.mouseDown(element)
  fireEvent.mouseUp(element)
  fireEvent.click(element)
}

describe('Modal', () => {
  it("n'affiche pas son contenu quand elle est fermée", () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        Employee Created!
      </Modal>,
    )

    expect(screen.queryByText('Employee Created!')).toBeNull()
    expect(document.querySelector('dialog').open).toBe(false)
  })

  it('ouvre le <dialog> et affiche son contenu', () => {
    render(
      <Modal isOpen onClose={() => {}}>
        Employee Created!
      </Modal>,
    )

    expect(screen.getByText('Employee Created!')).toBeTruthy()
    expect(document.querySelector('dialog').open).toBe(true)
  })

  it("se ferme quand `isOpen` repasse à false", () => {
    const { rerender } = render(<Modal isOpen onClose={() => {}} />)
    rerender(<Modal isOpen={false} onClose={() => {}} />)

    expect(document.querySelector('dialog').open).toBe(false)
  })

  it('relie le titre à la modale pour les lecteurs d’écran', () => {
    render(<Modal isOpen onClose={() => {}} title="Confirmation" />)

    const dialog = document.querySelector('dialog')
    const title = screen.getByText('Confirmation')
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id)
  })

  it('utilise `ariaLabel` quand il n’y a pas de titre', () => {
    render(<Modal isOpen onClose={() => {}} ariaLabel="Confirmation" />)

    expect(document.querySelector('dialog').getAttribute('aria-label')).toBe('Confirmation')
  })

  it('appelle onClose au clic sur le bouton de fermeture', async () => {
    const onClose = vi.fn()
    render(<Modal isOpen onClose={onClose} closeLabel="Fermer" />)

    await userEvent.click(screen.getByLabelText('Fermer'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('masque le bouton de fermeture avec showCloseButton={false}', () => {
    render(<Modal isOpen onClose={() => {}} showCloseButton={false} />)

    expect(screen.queryByLabelText('Close')).toBeNull()
  })

  it('appelle onClose au clic sur l’overlay, mais pas au clic dans le contenu', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose}>
        Contenu
      </Modal>,
    )

    press(screen.getByText('Contenu'))
    expect(onClose).not.toHaveBeenCalled()

    press(document.querySelector('dialog'))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('reste ouverte quand un appui commencé dans le contenu est relâché sur l’overlay', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose}>
        Contenu
      </Modal>,
    )

    // Cas d'une sélection de texte qui déborde : le navigateur envoie alors le clic au <dialog>.
    const dialog = document.querySelector('dialog')
    fireEvent.mouseDown(screen.getByText('Contenu'))
    fireEvent.mouseUp(dialog)
    fireEvent.click(dialog)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('reste ouverte quand un appui commencé sur l’overlay est relâché dans le contenu', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose}>
        Contenu
      </Modal>,
    )

    const dialog = document.querySelector('dialog')
    fireEvent.mouseDown(dialog)
    fireEvent.mouseUp(screen.getByText('Contenu'))
    fireEvent.click(dialog)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('ignore le clic sur l’overlay avec closeOnOverlayClick={false}', () => {
    const onClose = vi.fn()
    render(<Modal isOpen onClose={onClose} closeOnOverlayClick={false} />)

    press(document.querySelector('dialog'))
    expect(onClose).not.toHaveBeenCalled()
  })

  it('appelle onClose avec la touche Échap', () => {
    const onClose = vi.fn()
    render(<Modal isOpen onClose={onClose} />)

    fireEvent.keyDown(document.querySelector('dialog'), { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('ignore la touche Échap avec closeOnEscape={false}', () => {
    const onClose = vi.fn()
    render(<Modal isOpen onClose={onClose} closeOnEscape={false} />)

    // fireEvent renvoie false quand l'événement a été annulé (preventDefault).
    const notPrevented = fireEvent.keyDown(document.querySelector('dialog'), { key: 'Escape' })

    expect(onClose).not.toHaveBeenCalled()
    expect(notPrevented).toBe(false)
  })

  it('annule la fermeture native demandée par le navigateur avec closeOnEscape={false}', () => {
    const onClose = vi.fn()
    render(<Modal isOpen onClose={onClose} closeOnEscape={false} />)

    const cancelEvent = new Event('cancel', { cancelable: true })
    fireEvent(document.querySelector('dialog'), cancelEvent)

    expect(onClose).not.toHaveBeenCalled()
    expect(cancelEvent.defaultPrevented).toBe(true)
  })
})
