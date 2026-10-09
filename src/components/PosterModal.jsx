import Modal from './Modal'

// Ficha técnica oficial (arte original do rótulo/post) em tela cheia.
export default function PosterModal({ beer, onClose }) {
  return (
    <Modal title={`Ficha técnica ${beer.name}`} labelledBy="poster-title" onClose={onClose} wide>
      <p id="poster-title" className="mb-4 pr-10 font-display text-2xl font-bold uppercase text-white">
        {beer.name} <span className="text-beer-gold">· ficha técnica</span>
      </p>
      <img src={`/images/beers/${beer.id}-poster.webp`} alt={`Ficha técnica da ${beer.name}: ${beer.style}, ${beer.abv}% de álcool`} className="mx-auto max-h-[70vh] w-auto rounded-2xl" />
    </Modal>
  )
}
