import { getFinalPunkte } from "./retrieveLivePunkte";
import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

const finalListHtmlPage = `
<!DOCTYPE html>
<head></head>
<body class="doctyperezension layoutstandard site_rad" id="top" data-analytics='{"title":"Nur ein Wort - Die 100 besten Songs mit einem Wort als Titel","handle":"/content/rbb/rad/musik/top_100/2025/wort/nur_ein_wort_die_top_100","createDate":20180621,"doctype":16,"login":1,"lang":"de","uuid":"025cf993-a57a-4849-8def-eb8c7dab5598","lastModified":202508041610,"chapter":["Musik","Top 100","2025 NUR EIN WORT: Nur ein Wort - Die 100 besten Songs mit einem Wort als Titel"],"ATIxtsite":549286,"ATIxtn2":"8","IVWcp":"radioeins_rbb"}'>
<div class="table layoutstandard"><table width="100%" cellspacing="0" cellpadding="1" border="1">
<tbody><tr class="count1 odd first"><td class="count1 odd first" height="20" width="42">1</td>
<td class="count2 even" width="247">Radiohead</td>
<td class="count3 odd last" width="247">Creep</td>
</tr><tr class="count2 even"><td class="count1 odd first" height="20">2</td>
<td class="count2 even">David Bowie</td>
<td class="count3 odd last">Heroes</td>
</tr><tr class="count3 odd"><td class="count1 odd first" height="20">3</td>
<td class="count2 even">Johnny Cash</td>
<td class="count3 odd last">Hurt</td>
</tr><tr class="count4 even"><td class="count1 odd first" height="20">4</td>
<td class="count2 even">Beastie Boys</td>
<td class="count3 odd last">Sabotage</td>
</tr><tr class="count5 odd"><td class="count1 odd first" height="20">5</td>
<td class="count2 even">Fleetwood Mac</td>
<td class="count3 odd last">Dreams</td>
</tr><tr class="count6 even"><td class="count1 odd first" height="20">6</td>
<td class="count2 even">The Beatles</td>
<td class="count3 odd last">Help</td>
</tr><tr class="count7 odd"><td class="count1 odd first" height="20">7</td>
<td class="count2 even">Aretha Franklin</td>
<td class="count3 odd last">Respect</td>
</tr><tr class="count8 even"><td class="count1 odd first" height="20">8</td>
<td class="count2 even">John Lennon</td>
<td class="count3 odd last">Imagine</td>
</tr><tr class="count9 odd"><td class="count1 odd first" height="20">9</td>
<td class="count2 even">The Beatles</td>
<td class="count3 odd last">Something</td>
</tr><tr class="count10 even"><td class="count1 odd first" height="20">10</td>
<td class="count2 even">Julie Andrews &amp; Dick Van Dyke</td>
<td class="count3 odd last">Supercalifragilisticexpialidocious</td>
</tr><tr class="count11 odd"><td class="count1 odd first" height="20">11</td>
<td class="count2 even">Spandau Ballet</td>
<td class="count3 odd last">True</td>
</tr><tr class="count12 even"><td class="count1 odd first" height="20">12</td>
<td class="count2 even">U2</td>
<td class="count3 odd last">One</td>
</tr><tr class="count13 odd"><td class="count1 odd first" height="20">13</td>
<td class="count2 even">Metallica</td>
<td class="count3 odd last">One</td>
</tr><tr class="count14 even"><td class="count1 odd first" height="20">14</td>
<td class="count2 even">Rio Reiser</td>
<td class="count3 odd last">Junimond</td>
</tr><tr class="count15 odd"><td class="count1 odd first" height="20">15</td>
<td class="count2 even">Prince &amp; The Revolution</td>
<td class="count3 odd last">Kiss</td>
</tr><tr class="count16 even"><td class="count1 odd first" height="20">16</td>
<td class="count2 even">Coldplay</td>
<td class="count3 odd last">Yellow</td>
</tr><tr class="count17 odd"><td class="count1 odd first" height="20">17</td>
<td class="count2 even">The Beatles</td>
<td class="count3 odd last">Yesterday</td>
</tr><tr class="count18 even"><td class="count1 odd first" height="20">18</td>
<td class="count2 even">The Smashing Pumpkins</td>
<td class="count3 odd last">Disarm</td>
</tr><tr class="count19 odd"><td class="count1 odd first" height="20">19</td>
<td class="count2 even">Adriano Celentano</td>
<td class="count3 odd last">Prisencolinensinainciusol</td>
</tr><tr class="count20 even"><td class="count1 odd first" height="20">20</td>
<td class="count2 even">Led Zeppelin</td>
<td class="count3 odd last">Kashmir</td>
</tr><tr class="count21 odd"><td class="count1 odd first" height="20">21</td>
<td class="count2 even">Foo Fighters</td>
<td class="count3 odd last">Everlong</td>
</tr><tr class="count22 even"><td class="count1 odd first" height="20">22</td>
<td class="count2 even">Edwin Starr</td>
<td class="count3 odd last">War</td>
</tr><tr class="count23 odd"><td class="count1 odd first" height="20">23</td>
<td class="count2 even">Blumfeld</td>
<td class="count3 odd last">Verstärker</td>
</tr><tr class="count24 even"><td class="count1 odd first" height="20">24</td>
<td class="count2 even">Jeff Buckley</td>
<td class="count3 odd last">Hallelujah</td>
</tr><tr class="count25 odd"><td class="count1 odd first" height="20">25</td>
<td class="count2 even">Toto</td>
<td class="count3 odd last">Africa</td>
</tr><tr class="count26 even"><td class="count1 odd first" height="20">26</td>
<td class="count2 even">Pixies</td>
<td class="count3 odd last">Hey</td>
</tr><tr class="count27 odd"><td class="count1 odd first" height="20">27</td>
<td class="count2 even">Johnny Cash</td>
<td class="count3 odd last">One</td>
</tr><tr class="count28 even"><td class="count1 odd first" height="20">28</td>
<td class="count2 even">Frank Ocean</td>
<td class="count3 odd last">Lost</td>
</tr><tr class="count29 odd"><td class="count1 odd first" height="20">29</td>
<td class="count2 even">Beck</td>
<td class="count3 odd last">Loser</td>
</tr><tr class="count30 even"><td class="count1 odd first" height="20">30</td>
<td class="count2 even">Pearl Jam</td>
<td class="count3 odd last">Alive</td>
</tr><tr class="count31 odd"><td class="count1 odd first" height="20">31</td>
<td class="count2 even">Oasis</td>
<td class="count3 odd last">Wonderwall</td>
</tr><tr class="count32 even"><td class="count1 odd first" height="20">32</td>
<td class="count2 even">Joni Mitchell</td>
<td class="count3 odd last">Blue</td>
</tr><tr class="count33 odd"><td class="count1 odd first" height="20">33</td>
<td class="count2 even">Florence + The Machine</td>
<td class="count3 odd last">King</td>
</tr><tr class="count34 even"><td class="count1 odd first" height="20">34</td>
<td class="count2 even">Tears For Fears</td>
<td class="count3 odd last">Shout</td>
</tr><tr class="count35 odd"><td class="count1 odd first" height="20">35</td>
<td class="count2 even">The Beatles</td>
<td class="count3 odd last">Blackbird</td>
</tr><tr class="count36 even"><td class="count1 odd first" height="20">36</td>
<td class="count2 even">Oasis</td>
<td class="count3 odd last">Supersonic</td>
</tr><tr class="count37 odd"><td class="count1 odd first" height="20">37</td>
<td class="count2 even">The Cure</td>
<td class="count3 odd last">Lullaby</td>
</tr><tr class="count38 even"><td class="count1 odd first" height="20">38</td>
<td class="count2 even">Pixies</td>
<td class="count3 odd last">Debaser</td>
</tr><tr class="count39 odd"><td class="count1 odd first" height="20">39</td>
<td class="count2 even">Wir Sind Helden</td>
<td class="count3 odd last">Denkmal</td>
</tr><tr class="count40 even"><td class="count1 odd first" height="20">40</td>
<td class="count2 even">Michael Jackson</td>
<td class="count3 odd last">Thriller</td>
</tr><tr class="count41 odd"><td class="count1 odd first" height="20">41</td>
<td class="count2 even">Massive Attack</td>
<td class="count3 odd last">Teardrop</td>
</tr><tr class="count42 even"><td class="count1 odd first" height="20">42</td>
<td class="count2 even">Bruce Springsteen</td>
<td class="count3 odd last">Badlands</td>
</tr><tr class="count43 odd"><td class="count1 odd first" height="20">43</td>
<td class="count2 even">The Smiths</td>
<td class="count3 odd last">Ask</td>
</tr><tr class="count44 even"><td class="count1 odd first" height="20">44</td>
<td class="count2 even">Kate Bush</td>
<td class="count3 odd last">Cloudbusting</td>
</tr><tr class="count45 odd"><td class="count1 odd first" height="20">45</td>
<td class="count2 even">The Police</td>
<td class="count3 odd last">Roxanne</td>
</tr><tr class="count46 even"><td class="count1 odd first" height="20">46</td>
<td class="count2 even">Madonna</td>
<td class="count3 odd last">Vogue</td>
</tr><tr class="count47 odd"><td class="count1 odd first" height="20">47</td>
<td class="count2 even">EMF</td>
<td class="count3 odd last">Unbelievable</td>
</tr><tr class="count48 even"><td class="count1 odd first" height="20">48</td>
<td class="count2 even">Britney Spears</td>
<td class="count3 odd last">Toxic</td>
</tr><tr class="count49 odd"><td class="count1 odd first" height="20">49</td>
<td class="count2 even">Pearl Jam</td>
<td class="count3 odd last">Black</td>
</tr><tr class="count50 even"><td class="count1 odd first" height="20">50</td>
<td class="count2 even">Dolly Parton</td>
<td class="count3 odd last">Jolene</td>
</tr><tr class="count51 odd"><td class="count1 odd first" height="20">51</td>
<td class="count2 even">Black Sabbath</td>
<td class="count3 odd last">Paranoid</td>
</tr><tr class="count52 even"><td class="count1 odd first" height="20">52</td>
<td class="count2 even">The Cramps</td>
<td class="count3 odd last">Kizmiaz</td>
</tr><tr class="count53 odd"><td class="count1 odd first" height="20">53</td>
<td class="count2 even">Kraftwerk</td>
<td class="count3 odd last">Autobahn</td>
</tr><tr class="count54 even"><td class="count1 odd first" height="20">54</td>
<td class="count2 even">Death Cab For Cutie</td>
<td class="count3 odd last">Transatlanticism</td>
</tr><tr class="count55 odd"><td class="count1 odd first" height="20">55</td>
<td class="count2 even">Moby</td>
<td class="count3 odd last">Go</td>
</tr><tr class="count56 even"><td class="count1 odd first" height="20">56</td>
<td class="count2 even">The Goo Goo Dolls</td>
<td class="count3 odd last">Iris</td>
</tr><tr class="count57 odd"><td class="count1 odd first" height="20">57</td>
<td class="count2 even">Nina Hagen Band</td>
<td class="count3 odd last">Pank</td>
</tr><tr class="count58 even"><td class="count1 odd first" height="20">58</td>
<td class="count2 even">Robbie Williams</td>
<td class="count3 odd last">Angels</td>
</tr><tr class="count59 odd"><td class="count1 odd first" height="20">59</td>
<td class="count2 even">Portishead</td>
<td class="count3 odd last">Roads</td>
</tr><tr class="count60 even"><td class="count1 odd first" height="20">60</td>
<td class="count2 even">Bilderbuch</td>
<td class="count3 odd last">Maschin</td>
</tr><tr class="count61 odd"><td class="count1 odd first" height="20">61</td>
<td class="count2 even">Iggy &amp; The Stooges</td>
<td class="count3 odd last">Dirt</td>
</tr><tr class="count62 even"><td class="count1 odd first" height="20">62</td>
<td class="count2 even">Nina Simone</td>
<td class="count3 odd last">Sinnerman</td>
</tr><tr class="count63 odd"><td class="count1 odd first" height="20">63</td>
<td class="count2 even">The Velvet Underground</td>
<td class="count3 odd last">Heroin</td>
</tr><tr class="count64 even"><td class="count1 odd first" height="20">64</td>
<td class="count2 even">Gerhard Gundermann</td>
<td class="count3 odd last">Gras</td>
</tr><tr class="count65 odd"><td class="count1 odd first" height="20">65</td>
<td class="count2 even">Beach House</td>
<td class="count3 odd last">Myth</td>
</tr><tr class="count66 even"><td class="count1 odd first" height="20">66</td>
<td class="count2 even">David Bowie</td>
<td class="count3 odd last">Lazarus</td>
</tr><tr class="count67 odd"><td class="count1 odd first" height="20">67</td>
<td class="count2 even">The Clash</td>
<td class="count3 odd last">Garageland</td>
</tr><tr class="count68 even"><td class="count1 odd first" height="20">68</td>
<td class="count2 even">Blumfeld</td>
<td class="count3 odd last">Zeittotschläger</td>
</tr><tr class="count69 odd"><td class="count1 odd first" height="20">69</td>
<td class="count2 even">Clueso</td>
<td class="count3 odd last">Gewinner</td>
</tr><tr class="count70 even"><td class="count1 odd first" height="20">70</td>
<td class="count2 even">Die Prinzen</td>
<td class="count3 odd last">Bombe</td>
</tr><tr class="count71 odd"><td class="count1 odd first" height="20">71</td>
<td class="count2 even">Lorde</td>
<td class="count3 odd last">Royals</td>
</tr><tr class="count72 even"><td class="count1 odd first" height="20">72</td>
<td class="count2 even">Nirvana</td>
<td class="count3 odd last">Lithium</td>
</tr><tr class="count73 odd"><td class="count1 odd first" height="20">73</td>
<td class="count2 even">Pharrell Williams</td>
<td class="count3 odd last">Happy</td>
</tr><tr class="count74 even"><td class="count1 odd first" height="20">74</td>
<td class="count2 even">Stevie Wonder</td>
<td class="count3 odd last">Superstition</td>
</tr><tr class="count75 odd"><td class="count1 odd first" height="20">75</td>
<td class="count2 even">Fleetwood Mac</td>
<td class="count3 odd last">Landslide</td>
</tr><tr class="count76 even"><td class="count1 odd first" height="20">76</td>
<td class="count2 even">Billie Eilish</td>
<td class="count3 odd last">Chihiro</td>
</tr><tr class="count77 odd"><td class="count1 odd first" height="20">77</td>
<td class="count2 even">Betterov</td>
<td class="count3 odd last">Dussmann</td>
</tr><tr class="count78 even"><td class="count1 odd first" height="20">78</td>
<td class="count2 even">Amy Winehouse</td>
<td class="count3 odd last">Rehab</td>
</tr><tr class="count79 odd"><td class="count1 odd first" height="20">79</td>
<td class="count2 even">Van Halen</td>
<td class="count3 odd last">Jump</td>
</tr><tr class="count80 even"><td class="count1 odd first" height="20">80</td>
<td class="count2 even">Turbostaat</td>
<td class="count3 odd last">Insel</td>
</tr><tr class="count81 odd"><td class="count1 odd first" height="20">81</td>
<td class="count2 even">Fehlfarben</td>
<td class="count3 odd last">Grauschleier</td>
</tr><tr class="count82 even"><td class="count1 odd first" height="20">82</td>
<td class="count2 even">Mark Ronson ft. Amy Winehouse</td>
<td class="count3 odd last">Valerie</td>
</tr><tr class="count83 odd"><td class="count1 odd first" height="20">83</td>
<td class="count2 even">Yeah Yeah Yeahs</td>
<td class="count3 odd last">Maps</td>
</tr><tr class="count84 even"><td class="count1 odd first" height="20">84</td>
<td class="count2 even">David Bowie</td>
<td class="count3 odd last">Blackstar</td>
</tr><tr class="count85 odd"><td class="count1 odd first" height="20">85</td>
<td class="count2 even">Joy Division</td>
<td class="count3 odd last">Atmosphere</td>
</tr><tr class="count86 even"><td class="count1 odd first" height="20">86</td>
<td class="count2 even">The Chats</td>
<td class="count3 odd last">Smoko</td>
</tr><tr class="count87 odd"><td class="count1 odd first" height="20">87</td>
<td class="count2 even">Earth, Wind &amp; Fire</td>
<td class="count3 odd last">September</td>
</tr><tr class="count88 even"><td class="count1 odd first" height="20">88</td>
<td class="count2 even">Alice Cooper</td>
<td class="count3 odd last">Poison</td>
</tr><tr class="count89 odd"><td class="count1 odd first" height="20">89</td>
<td class="count2 even">Blondie</td>
<td class="count3 odd last">Atomic</td>
</tr><tr class="count90 even"><td class="count1 odd first" height="20">90</td>
<td class="count2 even">Herbert Grönemeyer</td>
<td class="count3 odd last">Mensch</td>
</tr><tr class="count91 odd"><td class="count1 odd first" height="20">91</td>
<td class="count2 even">Fugazi</td>
<td class="count3 odd last">Blueprint</td>
</tr><tr class="count92 even"><td class="count1 odd first" height="20">92</td>
<td class="count2 even">Beatsteaks</td>
<td class="count3 odd last">Automatic</td>
</tr><tr class="count93 odd"><td class="count1 odd first" height="20">93</td>
<td class="count2 even">Queen</td>
<td class="count3 odd last">Innuendo</td>
</tr><tr class="count94 even"><td class="count1 odd first" height="20">94</td>
<td class="count2 even">The Sonics</td>
<td class="count3 odd last">Strychnine</td>
</tr><tr class="count95 odd"><td class="count1 odd first" height="20">95</td>
<td class="count2 even">Tool</td>
<td class="count3 odd last">Schism</td>
</tr><tr class="count96 even"><td class="count1 odd first" height="20">96</td>
<td class="count2 even">Die Art</td>
<td class="count3 odd last">Radiokrieg</td>
</tr><tr class="count97 odd"><td class="count1 odd first" height="20">97</td>
<td class="count2 even">Rihanna ft. JAY-Z</td>
<td class="count3 odd last">Umbrella</td>
</tr><tr class="count98 even"><td class="count1 odd first" height="20">98</td>
<td class="count2 even">Nine Inch Nails</td>
<td class="count3 odd last">Hurt</td>
</tr><tr class="count99 odd"><td class="count1 odd first" height="20">99</td>
<td class="count2 even">Taylor Swift</td>
<td class="count3 odd last">Lover</td>
</tr><tr class="count100 even last"><td class="count1 odd first" height="20">100</td>
<td class="count2 even">Commodores</td>
<td class="count3 odd last">Easy</td>
</tr></tbody></table>
</div>
	</body>
</html>
`;

describe("retrieveLivePunkte", () => {
  describe("final list", () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        text: () => Promise.resolve(finalListHtmlPage),
      }),
    ) as jest.Mock;

    it("must have 100 songs in the list", async () => {
      const finalPlaylist = await getFinalPunkte("Top100NurEinWort");
      expect(finalPlaylist).toHaveLength(100);
    })

    it("must be number one Radiohead - Creep", async () => {
      const [{artist, title}] = await getFinalPunkte("Top100NurEinWort");
      expect(artist).toBe("Radiohead");
      expect(title).toBe("Creep");
    })
  })
});