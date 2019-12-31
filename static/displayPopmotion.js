function displayPopmotion(){
  const title = document.forms["uploadForm"]["contentTitle"].value
  const author = document.forms["uploadForm"]["author"].value
  const description = document.forms["uploadForm"]["contentDescription"].value
  const avatar = document.forms["uploadForm"]["avatar"].value

  console.log(title)
  console.log(author)
  console.log(description)
  console.log(avatar)

  if (title == "" || author== "" || description == "" || avatar == ""){
    return false
  }
  else{
    console.log("hello")
    const popmotionBox = document.querySelector(".popmotion-container-none")
    popmotionBox.classList.toggle("popmotion-container-flex")
    const { styler, everyFrame } = popmotion;
    const container = document.querySelector('.balls')
    const ballStylers = Array
      .from(container.childNodes)
      .map(styler)
    const distance = 10
    everyFrame()
      .start((timestamp) => ballStylers.map((thisStyler, i) => {
        thisStyler.set('y', distance * Math.sin(0.004 * timestamp + (i * 0.5)))
    }))
  }
}