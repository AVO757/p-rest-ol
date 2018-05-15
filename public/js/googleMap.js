var head = document.getElementsByTagName('head')[0];

// Save the original method
var insertBefore = head.insertBefore;

// Replace it!
head.insertBefore = function (newElement, referenceElement) {

    if (newElement.href && newElement.href.indexOf('https://fonts.googleapis.com/css?family=Roboto') === 0) {

        console.info('Prevented Roboto from loading!');
        return;
    }

    insertBefore.call(head, newElement, referenceElement);
};

// Check it!
new google.maps.Map(document.getElementById('map'), {
    center: new google.maps.LatLng(51.508742, -0.120850),
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: false,
    zoomControl: false,
    panControl: false,
    mapTypeControl: false
});