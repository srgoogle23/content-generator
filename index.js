const TurndownService = require('turndown');
const turndownService = new TurndownService();
var fs = require('fs');

const axios = require('axios');
const cheerio = require('cheerio');


/*
const markdown = turndownService.turndown(`
    <h1>JavaScript for Beginners</h1>
    <p>Follow <a href="https://attacomsian.com/blog">Atta</a> to learn <b>JavaScript</b> from scratch!</p>
`);
*/

//console.log(markdown);

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

const getmarkdown = async () =>
{
    try {
		const { data } = await axios.get(
            'https://medium.com/tag/aws/'
        );
        const $ = cheerio.load(data);
        const postsLinks = [];
    
        $('div.em.l > a.fa.fb.fc.fd.fe.ff.fg.fh.fi.fj.fk.fl.fm.fn.fo').each((_idx, el) => {
            const postLink = $(el).attr('href')
            postsLinks.push(postLink)
        });
    

        for (const element of postsLinks) {
            
            const { data } = await axios.get(
                element
            );
            const $ = cheerio.load(data);
            const postContents = [];
    
            $('section').each((_idx, el) => {
                const postContent = $(el).html();
                postContents.push(postContent);
            });
    
            const html = postContents.slice(-1).pop();
            const markdown = turndownService.turndown(html);

            fs.appendFile(makeid(8) + '.md', markdown, function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('Saved!');
                }
            })
        }

        return true;
    }
    catch (error)
    {
		//throw error;
	}
};

//getmarkdown().then(markdowns => { console.log(markdowns); });
getmarkdown();