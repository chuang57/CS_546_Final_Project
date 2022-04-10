const express = require("express");
const router = express.Router();

router.route("/city-choosing").get(async (req, res) => {
  try {
    // const bands = await bandsData.getAll();
    res.render("city-choosing");
  } catch (e) {
    res.status(400).json(e);
  }
});

router.route("/apartment").get(async (req, res) => {
  try {
    // const bands = await bandsData.getAll();
    res.render("apartment-list", {
      citys: [
        {
          photos: [
            "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjAxMjNfODYg%2FMDAxNjQyOTM4NzIwOTc3.sQMhSBWe-RPq-YVjUFGTU1PoKg7f8y1z5ZwazDjDhnAg.nTappjPa5nNbZ_0g53EMNltkgAWb6tYrb-gvMr6hkhUg.JPEG.sdh622%2F28337d111925579aada11bc691645cd3.jpg&type=a340",
            "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjAxMjNfODYg%2FMDAxNjQyOTM4NzIwOTc3.sQMhSBWe-RPq-YVjUFGTU1PoKg7f8y1z5ZwazDjDhnAg.nTappjPa5nNbZ_0g53EMNltkgAWb6tYrb-gvMr6hkhUg.JPEG.sdh622%2F28337d111925579aada11bc691645cd3.jpg&type=a340",
          ],
          appartmentName: "abc-apart",
          state: "NJ",
          city: "Hoboken",
          address: "address",
          zipcode: "00000",
          rentprice: "3000",
          price: "90000",
          size: "500",
          occupantCapacity: "4",
        },
        {
          appartmentName: "abc-apart",
          state: "NJ",
          city: "Hoboken",
          address: "address",
          zipcode: "00000",
          rentprice: "3000",
          price: "90000",
          size: "500",
          occupantCapacity: "4",
          reviews: [
            {
              name: "Christian Huang",
              rating: 5,
              desc: "Great apartment, would suggest!",
            },
          ],
        },
      ],
    });
  } catch (e) {
    res.status(400).json(e);
  }
});

router.route("/apartment/:id").get(async (req, res) => {
  try {
    // const bands = await bandsData.getAll();
    res.render("apartment-detail", {
      data: {
        photos: [
          "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjAxMjNfODYg%2FMDAxNjQyOTM4NzIwOTc3.sQMhSBWe-RPq-YVjUFGTU1PoKg7f8y1z5ZwazDjDhnAg.nTappjPa5nNbZ_0g53EMNltkgAWb6tYrb-gvMr6hkhUg.JPEG.sdh622%2F28337d111925579aada11bc691645cd3.jpg&type=a340",
          "https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMjAxMjNfODYg%2FMDAxNjQyOTM4NzIwOTc3.sQMhSBWe-RPq-YVjUFGTU1PoKg7f8y1z5ZwazDjDhnAg.nTappjPa5nNbZ_0g53EMNltkgAWb6tYrb-gvMr6hkhUg.JPEG.sdh622%2F28337d111925579aada11bc691645cd3.jpg&type=a340",
        ],
        appartmentName: "abc-apart",
        state: "NJ",
        city: "Hoboken",
        address: "address",
        zipcode: "00000",
        rentprice: "3000",
        price: "90000",
        size: "500",
        occupantCapacity: "4",
      },
    });
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = router;
