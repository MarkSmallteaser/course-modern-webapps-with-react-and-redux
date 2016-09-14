const StudyModal = ({ card, showBack, onFlip, onStudied }) => {
  let body = (
    <div className='no-cards'>
      <p> You have no cards to study in this deck right now. Good job! </p>
    </div>
  );

  if (card) {
    body = (
      <div className='study-card'>
        <div className={showBack ? 'front hide' : 'front'}>
          <div>
            <p> { card.front } </p>
          </div>
          <button onClick={onFlip}> Flip </button>
        </div>
        <div className={showBack ? 'back' : 'back hide'}>
          <div>
            <p> { card.back } </p>
          </div>
          <p> How did you do? </p>
          <button onClick={e => onStudied(card.id, Math.max(card.score - 1, 1))}> Poorly </button>
          <button onClick={e => onStudied(card.id, card.score)}> Okay </button>
          <button onClick={e => onStudied(card.id, Math.min(card.score + 1))}> Great </button>
        </div>
      </div>
    );
  }
};