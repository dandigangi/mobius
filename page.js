if(window.location.host.indexOf('chrono24') > -1) {
  const htmlButtonBar = `
    <div class="mobius__controls__container">
      <button class="mobius__hideListingsButton mobius__button">
        Hide Dealers & Non-US Listings
      </button>
    </div>`;

  $('body').prepend(htmlButtonBar);
  $('.mobius__hideListingsButton').click(handleHideListings);

  function handleHideListings() {
    $('.article-item-container .article-seller-name:contains("Professional dealer")')
      .parents('.article-item-container')
      .hide();

    $('.article-item-container i.rflag')
      .not('.rf-US')
      .parents('.article-item-container')
      .hide();

    $('.mobius__hideListingsButton')
      .addClass('mobius__button__disabled')
      .prop('disabled', true)
      .text('Listings Hidden');
  }
}