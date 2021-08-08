$('.mobius__popout__hideListingsButton').click(async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTabUrl = tab.url;

  if (!tab || tab && tab.url.indexOf('chrono24') < 0) {
    $('.mobius__popout__container').html('<h2>You are not on Chrono24.com</h1>');
    return false;
  };

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: handleHideListings,
  });
});

function handleHideListings() {
  $('.article-item-container .article-seller-name:contains("Professional dealer")')
    .parents('.article-item-container')
    .hide();

  $('.article-item-container i.rflag')
    .not('.rf-US')
    .parents('.article-item-container')
    .hide();

  $('.mobius__popout__hideListingsButton, .mobius__hideListingsButton')
    .addClass('mobius__button__disabled')
    .prop('disabled', true)
    .text('Listings Hidden');

  $('.mobius__popout__hideListingsButton')
    .css('opacity', 1);
}