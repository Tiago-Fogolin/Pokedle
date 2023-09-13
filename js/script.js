const apiUrl = "https://pokeapi.co/api/v2/pokemon/";
var pokemons = [];
var hearts = 5;
var displayed_hearts = []
var ans = 0
const pokemon_number = Math.floor((Math.random() * 120) + 1);

function fetchNewPokemons() {
  pokemons = [];
  hearts = 5
  ans = 0
  updateHearts(hearts)
  Promise.all(fetchPromises())
    .then(() => {
      updateGame();
    });
}


function fetchPokemonData(i) {
  var urlAtual = apiUrl + i.toString() + "/";
  return fetch(urlAtual)
    .then(response => {
      if (!response.ok) {
        throw new Error("Não foi possível conectar.");
      }
      return response.json();
    })
    .then(data => {
      pokemons.push({"name":data.name,
      "img":data.sprites["front_default"]});
    })
    .catch(error => {
      console.error(error);
    });
}

function fetchPromises(){
  var fetch_promises = [];

  for (let i = pokemon_number; i < pokemon_number + 20; i++) {
    fetch_promises.push(fetchPokemonData(i));
  }
  return fetch_promises
}


function updateGame(){
  if(ans == 20 ){
    window.location.href = "win.html";
  }
  let right = false
  let random_pokemon = pokemons[Math.floor(Math.random()*pokemons.length)]
  pokemons = pokemons.filter(i => i != random_pokemon)
  let cover_divs = displayRandomPokemon(random_pokemon)
  let pokemon_name = random_pokemon["name"]
  let btn = document.getElementById("btn_send")
  let text_input = document.getElementById("text_input")
  let answer = document.getElementById("answer")
  let feedback_div = document.getElementById("feedback")
  function click(){
    
    if(!right){
    if(text_input.value.toLowerCase() == pokemon_name){
      ans++
      right = true
      answer.classList.forEach((e) => answer.classList.remove(e))
      answer.innerText = "Você acertou!"
      answer.classList.add("correct_text")
      document.getElementById("image_div").classList.add("correct_border")
      cover_divs = removeCoverDivs(cover_divs)
      let next_btn = document.createElement("button")
      next_btn.innerText = "Próximo"
      next_btn.classList.add("next_btn")
      next_btn.addEventListener("click", () =>{
        document.getElementById("pokemon_img").remove()
        updateGame()
        answer.innerText = ""
        document.getElementById("image_div").classList.remove("correct_border")
        btn.removeEventListener("click",click)
        next_btn.remove()
      })
      feedback_div.appendChild(next_btn)
    }else{
      if(text_input.value != ""){
        if(cover_divs.length > 0){
        let div_remover = cover_divs[Math.floor(Math.random()*cover_divs.length)]
        div_remover.remove()
        cover_divs = cover_divs.filter(i => i != div_remover)
        }
        if(hearts > 0){
          hearts--
          updateHearts(hearts)
        }
        if(hearts == 0){
          answer.innerText = `Você perdeu! O pokemon era ${pokemon_name}`
          answer.classList.forEach((e) => answer.classList.remove(e))
          answer.classList.add("wrong_text")
          cover_divs = removeCoverDivs(cover_divs)
          let restart_btn = document.createElement("button")
          restart_btn.innerText = "Recomeçar o jogo"
          restart_btn.classList.add("next_btn")
          restart_btn.addEventListener("click", () =>{
            document.getElementById("pokemon_img").remove()
            fetchNewPokemons()
            answer.innerText = ""
            document.getElementById("image_div").classList.remove("correct_border")
            btn.removeEventListener("click",click)
            restart_btn.remove()
          })
          feedback_div.appendChild(restart_btn)
        }
      }
      
    }
  }
}
  btn.addEventListener("click",click)
  text_input.addEventListener("keydown",(e) =>{
    if(e.key === "Enter"){
      click()
    }
  })
  
}


function displayRandomPokemon(random_pokemon){
  let answer = document.getElementById("answer")
  answer.innerText = ""
  let img = document.createElement("img")
  img.src = random_pokemon["img"]
  img.height = 200
  img.width = 200
  img.id = "pokemon_img"
  document.getElementById("image_div").appendChild(img)
  return addCoverDivs()
}

function addCoverDivs(){
  let image_div = document.getElementById("image_div")
  let cover_divs = []
  for(let i = 1; i <= 4; i++){
    let cover_class = "cover_div" + i.toString()
    let cover_div = document.createElement("div")
    cover_div.classList.add("cover_div")
    cover_div.classList.add(cover_class)
    image_div.appendChild(cover_div)
    cover_divs.push(cover_div)
  }
  
  var remove_div = cover_divs[Math.floor(Math.random()*cover_divs.length)]
  remove_div.remove()
  cover_divs = cover_divs.filter(i => i != remove_div)
 
  return cover_divs
}

function removeCoverDivs(cover_divs){
  cover_divs.forEach((e) => {
    e.remove()
  })
  cover_divs = []
  return cover_divs
}

function updateHearts(hearts){
  let hearts_div = document.getElementById("hearts_div");
  displayed_hearts.forEach((e) => e.remove())
  displayed_hearts = []
  for(let i = 0; i < hearts; i++){
    let heart = document.createElement("img");
    heart.src="assets/heart.png";
    heart.width = 50;
    heart.height = 50;
    hearts_div.appendChild(heart);
    displayed_hearts.push(heart)
  }
  for(let i = 0; i < 5-hearts; i++){
    let empty_heart = document.createElement("img");
    empty_heart.src="assets/empty_heart.png";
    empty_heart.width = 50;
    empty_heart.height = 50;
    hearts_div.appendChild(empty_heart);
    displayed_hearts.push(empty_heart)
  }
}

fetchNewPokemons()
