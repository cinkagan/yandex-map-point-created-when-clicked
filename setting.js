var bilgiler = [{
    'baslik': 'Konum 1',
    'konum': [39.758302083601244, 28.657235710937485],
    'resim': 'https://picsum.photos/200/300'
},
{
    'baslik': 'Konum 2',
    'konum': [39.764661314342, 30.50705870898432],
    'resim': 'https://picsum.photos/200/300'
},
{
    'baslik': 'Konum 3',
    'konum': [39.717378, 30.508432],
    'resim': 'https://picsum.photos/200/300'
},
{
    'baslik': 'Konum 4',
    'konum': [39.747378, 30.508432],
    'resim': 'https://picsum.photos/200/300'
},
];
var konum = $('#konum');
ymaps.ready(init);

function init() {
var myPlacemark,
    myMap = new ymaps.Map('map', {
        center: [39.777378, 30.508432], // Ben varsayılan olarak eskişehir konumunu koydum
        zoom: 13
    }, {
        searchControlProvider: 'yandex#search'
    });

// eğer elinizdeki konuma bir etiket eklemek istiyorsanız
myLastObject = new ymaps.GeoObject({
    geometry: {
        type: "Point", // Ben nokta olarak kullanacağım dilerseniz siz farklı kullanabilirsiniz https://tech.yandex.com/maps/doc/jsapi/2.1/dg/concepts/geoobjects-docpage/
        coordinates: [39.777378, 30.508432] // bu konuma bir 
    },
    properties: {
        iconContent: 'Mevcut Konum',
        hintContent: 'Sürükleyebilirsiniz'
    }
}, {
    preset: 'islands#redStretchyIcon', // Kırmızı renkte ve içerisindeki yazıya göre uygun uzunlukta
    draggable: true // sürükleyi açıyorum 
});

myMap.geoObjects.add(myLastObject); // harita üzerine eski konumu ekliyorum

// eğer elinizde bir den fazla veri varsa 
var myCollection = new ymaps.GeoObjectCollection();
bilgiler.forEach((item) => {
    console.log(item.konum);

    myCollection.add(new ymaps.Placemark(item.konum, {
        iconContent: item.baslik,
        hintContent: 'Sürükleyebilirsiniz'
    }, {
        preset: 'islands#redStretchyIcon'
    }));

});
myMap.geoObjects.add(myCollection);



// tıklama işleminde haritada ya nokta eklemek için
myMap.events.add('click', function (e) {
    var coords = e.get('coords');
    console.log(coords); // ekrana yazdıralım
    konum.val(coords); // input a konumu atalım

    if (myPlacemark) {
        myPlacemark.geometry.setCoordinates(coords);
    } else {
        myPlacemark = createPlacemark(coords);
        myMap.geoObjects.add(myPlacemark);

        myPlacemark.events.add('dragend', function () {
            getAddress(myPlacemark.geometry.getCoordinates());
        });

    }
    getAddress(coords);
});

// Placemark oluşturalım
function createPlacemark(coords) {
    return new ymaps.Placemark(coords, {
        iconCaption: 'Aranıyor...'
    }, {
        preset: 'islands#violetDotIconWithCaption',
        draggable: true
    });
}

//Adresin koordinatlarla belirlenmesi
function getAddress(coords) {
    myPlacemark.properties.set('iconCaption', 'searching...');
    ymaps.geocode(coords).then(function (res) {
        var firstGeoObject = res.geoObjects.get(0);

        myPlacemark.properties
            .set({
                iconCaption: [
                    firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() :
                    firstGeoObject.getAdministrativeAreas(),
                    firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                ].filter(Boolean).join(', '),
                balloonContent: firstGeoObject.getAddressLine()
            });
    });
}

// harita üzerinden scroll ile zoom yapmayı kapatmak için
myMap.behaviors.disable('scrollZoom');
}