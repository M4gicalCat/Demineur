class Case
{

    constructor(type, revele, x, y, nombre) {
        this._revele = revele;
        this._type = type;
        this._x = x;
        this._y = y;
        this._nombre = nombre;
    }

    get revele() {
        return this._revele;
    }

    set revele(value) {
        this._revele = value;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get nombre() {
        return this._nombre;
    }

    set nombre(value) {
        this._nombre = value;
    }
}

/***
 * retourne le nombre de bombe à côté de cette case
 * @param x la position x de la case
 * @param y la position y de la case
 * @param grille la grille de jeu
 */
function getNbBombes(x,y,grille)
{
    let xmin, xmax, ymin, ymax;
    if (x === 0)
    {
        xmin = 0;
        xmax = 1;
    }
    else if (x === grille.length -1)
    {
        xmin = x - 1;
        xmax = x;
    }
    else
    {
        xmin = x-1;
        xmax = x+1;
    }

    if (y === 0)
    {
        ymin = 0;
        ymax = 1;
    }
    else if (y === grille.length -1)
    {
        ymin = y - 1;
        ymax = grille.length -1;
    }
    else
    {
        ymin = y-1;
        ymax = y+1;
    }
    let nbBombe = 0;
    let yMaxi = ymax;
    let yMini = ymin;

    for (xmin; xmin <= xmax; xmin++)
    {
        yMaxi = ymax;
        yMini = ymin;
        for (yMini; yMini <= yMaxi; yMini++)
        {
            if (grille[xmin][yMini].type === "bombe")
            {
                nbBombe++;
            }
        }
    }
    return nbBombe;

}

/***
 * retourne la grille vide
 * @param nbCaseCote le nombre de cases sur un côté (grille carrée)
 * @returns {[la grille]}
 */
function createGrille(nbCaseCote)
{
    let grille = [];
    for(let i = 0; i < nbCaseCote; i++)
    {
        for (let j = 0; j < nbCaseCote; j++)
        {
            let case1 = new Case("vide", false, i, j);
            grille.push(case1);
        }
    }
    return grille;
}

/***
 * retourne la grille (préalablement créée), avec le nombre de bombe en fonction de la difficulté
 * @param grille la grille déjà créee
 * @param difficulte la difficulté choisie préalablement
 * @returns {[la grille avec les bombes]}
 */
function init(grille, difficulte)
{
    let proba = 0.14;
    switch (difficulte)
    {
        case "simple":
            proba = 0.14;
            break;
        case "moyen":
            proba = 0.16;
            break;
        case "difficile":
            proba = 0.2;
            break;
        case "hardcore":
            proba = 0.5;
            break;
    }
    let bombes = [];
    let bombesFinales = [];
    let bombeRentree = false;
    let bombedispo = true;
    let nbBombes = Math.floor(grille.length * proba);
    for (let i=0; i<nbBombes; i++)
    {
        bombeRentree = false;
        bombes = [];
        for (let j=0; j < grille.length; j++)
        {
            let bombe = Math.random();
            if(bombe <= proba)
            {
                bombes.push(j);
            }
        }
        while (!bombeRentree)
        {
            if(bombes.length === 0){bombeRentree = true;}
            let bombeChoisie = Math.floor(Math.random() * bombes.length);
            bombeChoisie = bombes.splice(bombeChoisie, 1);
            for (let k=0; k<bombesFinales.length; k++)
            {
                if (bombeChoisie === bombesFinales[k])
                {
                    bombedispo = false;
                }
            }
            if(bombedispo === true)
            {
                bombesFinales.push(bombeChoisie);
                bombeRentree = true;
            }
        }
    }
    console.log(bombesFinales);
    for(let i = 0; i<bombesFinales.length; i++)
    {
        grille[bombesFinales[i][0]].type = "bombe";
    }

//tableau 1D => tableau 2D

    let grille2 = [];
    let ligne = [];

    for (let i = 0; i < Math.sqrt(grille.length); i++)
    {
        ligne = [];
        for (let j = 0; j < Math.sqrt(grille.length); j++)
        {
            ligne.push(grille[i*Math.sqrt(grille.length) + j]);
        }
        grille2.push(ligne);
    }
    grille = grille2;


    for (let i = 0; i<grille.length; i++)
    {
        let ligne = grille[i];
        for (let j = 0; j<ligne.length; j++)
        {
            grille[i][j]._nombre = getNbBombes(i, j, grille);
            if (grille[i][j]._nombre === 0){grille[i][j]._nombre = " ";}
        }
    }
    return grille;
}

function revele(x, y)
{
    let grilleFinie = true;
    for (let i = 0; i < grilleDemineur.length; i++)
    {
        for (let j = 0; j <grilleDemineur.length; j++)
        {
            if(grilleDemineur[i][j]._type === "vide" && !grilleDemineur[i][j].revele)
            {
                grilleFinie = false;
            }
        }
    }
    if (!grilleFinie)
    {
        let id = x.toString() + "e" + y.toString();
        let carre = document.getElementById(id);
        let nbBombes = getNbBombes(x,y,grilleDemineur);
        let classes = carre.classList;
        let pasRevele = true;

        if(grilleDemineur[x][y].revele === true)
        {
            pasRevele = false;
        }

        for (let i=0; i<classes.length; i++)
        {
            if (classes[i] === "drapeau")
            {
                classes[i] = "";
            }
        }
        carre.classList = classes;
        if(pasRevele)
        {
            grilleDemineur[x][y]._revele = true;
            if (grilleDemineur[x][y].type === "bombe")
            {
                alert("BOOOOM");
                reveleFinal();
            }


            carre.classList += ' ';
            carre.classList += 'revele';


            if(nbBombes === 0)
            {
                let xmin, xmax, ymin, ymax;
                if (x === 0)
                {
                    xmin = 0;
                    xmax = 1;
                }
                else if (x === grilleDemineur.length -1)
                {
                    xmin = x - 1;
                    xmax = x;
                }
                else
                {
                    xmin = x-1;
                    xmax = x+1;
                }

                if (y === 0)
                {
                    ymin = 0;
                    ymax = 1;
                }
                else if (y === grilleDemineur.length -1)
                {
                    ymin = y - 1;
                    ymax = grilleDemineur.length -1;
                }
                else
                {
                    ymin = y-1;
                    ymax = y+1;
                }
                for (let i=xmin; i<=xmax; i++)
                {
                    for (let j=ymin; j<=ymax; j++)
                    {
                        revele(i, j);
                    }
                }
            }
        }
    }

    grilleFinie = true;
    for (let i = 0; i < grilleDemineur.length; i++)
    {
        for (let j = 0; j <grilleDemineur.length; j++)
        {
            if(grilleDemineur[i][j]._type === "vide" && !grilleDemineur[i][j].revele)
            {
                grilleFinie = false;
            }
        }
    }
    if(grilleFinie)
    {
        alert('Bravo, vous avez gagné !');
    }
}

function reset(id)
{
    document.getElementById(id).innerHTML = "";
    document.getElementById("grilleDem").innerHTML = "";
}

function game(id, nbCotes, difficulte)
{
    reset(id);
    document.getElementById("choix").innerHTML = "";

    grilleDemineur = init(createGrille(nbCotes), difficulte);
    console.log(grilleDemineur);
    for (let i=0; i<grilleDemineur.length; i++)
    {
        let ligne = grilleDemineur[i];
        document.getElementById("grille").innerHTML+= "<tr id='"+i.toString()+"'></tr>";
        for (let j = 0; j<ligne.length; j++)
        {
            document.getElementById(i.toString()).innerHTML += "<td id='"+ i.toString() + "e" + j.toString() +"' class='" + ligne[j].type + " " + "' onclick='revele(" + i +","+ j +")'>" + ligne[j].nombre + "</td>";
        }
    }
    for (let i = 0; i<grilleDemineur.length; i++)
    {
        for (let j = 0; j<grilleDemineur.length; j++)
        {
            let elem = document.getElementById(i.toString() + "e" + j.toString());
            elem.addEventListener('contextmenu', e => {
                e.preventDefault();
                let classes = elem.classList;
                for (let i=0; i<classes; i++)
                {
                    if( classes[i] === "revele" )
                    {
                        break;
                    }
                }
                elem.classList += " ";
                elem.classList += "drapeau";
            });
        }
    }
}

function reveleFinal()
{
    let pasRevele = true;
    let classes;
    for  (let i = 0; i<grilleDemineur.length; i++)
    {
        for (let j=0; j<grilleDemineur.length; j++)
        {
            pasRevele = true;
            classes = document.getElementById(i.toString() + "e"+j.toString()).classList;
            for (let k = 0; k < classes.length; k++)
            {
                if (classes[k] === "revele")
                {
                    pasRevele = false;
                }
            }
            if (pasRevele)
            {
                document.getElementById(i.toString() + "e"+j.toString()).classList += " ";
                document.getElementById(i.toString() + "e"+j.toString()).classList += "revele";
            }
        }
    }
}

function changeNbCotes()
{
    nbCotes = document.getElementById("nbCotes").value;
    console.log(nbCotes);
}

function changeDifficulte()
{
    difficulte = document.getElementById("difficulte").value;
    console.log(difficulte);
}