import feeds, { addFeed } from './feeds'
import folders, { addFolder } from './folders'
import OpmlReader from '../../lib/OpmlReader'

export const IMPORT_OPML = "IMPORT_OPML"

export function importOpml(xml) {
  return {
    type: IMPORT_OPML,
    payload: {
      xml
    }
  }
}

export function importSample() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <opml version="1.0">
    <head>
      <title>Sage OPML Export</title>
    </head>
    <body>
      <outline text="Sage Feeds">
        <outline text="Blogs">
          <outline type="rss" text="information aesthetics" title="information aesthetics" xmlUrl="http://infosthetics.com/atom.xml"/>
          <outline type="rss" text="FlowingData" title="FlowingData" xmlUrl="http://feeds.feedburner.com/FlowingData"/>
          <outline type="rss" text="Information is Beautiful" title="Information is Beautiful" xmlUrl="http://www.informationisbeautiful.net/feed/"/>
          <outline type="rss" text="Peter Beverloo" title="Peter Beverloo" xmlUrl="http://peter.sh/feed/"/>
          <outline type="rss" text="JavaScript" title="JavaScript" xmlUrl="https://blog.mozilla.org/javascript/feed/"/>
          <outline type="rss" text="Steve Sanderson's Blog" title="Steve Sanderson's Blog" xmlUrl="http://blog.stevensanderson.com/feed/"/>
          <outline type="rss" text="peter.michaux.ca" title="peter.michaux.ca" xmlUrl="http://peter.michaux.ca/feed/atom.xml"/>
          <outline type="rss" text="Knock Me Out" title="Knock Me Out" xmlUrl="http://feeds.feedburner.com/KnockMeOut"/>
          <outline type="rss" text="HTML5Rocks" title="HTML5Rocks" xmlUrl="http://feeds.feedburner.com/html5rocks"/>
          <outline type="rss" text="mir.aculo.us" title="mir.aculo.us" xmlUrl="http://feeds.feedburner.com/miraculous"/>
          <outline type="rss" text="Codrops" title="Codrops" xmlUrl="http://feeds2.feedburner.com/tympanus"/>
          <outline type="rss" text="CodyHouse » Gems" title="CodyHouse » Gems" xmlUrl="http://feeds.feedburner.com/codyhouse/feeds"/>
          <outline type="rss" text="Aerotwist Blog" title="Aerotwist Blog" xmlUrl="https://aerotwist.com/blog/feed/"/>
          <outline type="rss" text="Typewolf Blog" title="Typewolf Blog" xmlUrl="http://www.typewolf.com/blog/feed"/>
          <outline type="rss" text="John Resig" title="John Resig" xmlUrl="http://feeds.feedburner.com/JohnResig"/>
          <outline type="rss" text="TextMate Blog" title="TextMate Blog" xmlUrl="http://macromates.com/blog/feed/"/>
          <outline type="rss" text="Ciarán Walsh’s Blog" title="Ciarán Walsh’s Blog" xmlUrl="http://ciaranwal.sh/feed"/>
          <outline type="rss" text="Wes Maldonado:  Data Junkie" title="Wes Maldonado:  Data Junkie" xmlUrl="http://feeds.feedburner.com/BrokenBuildByWesMaldonado"/>
          <outline type="rss" text="The If Works" title="The If Works" xmlUrl="http://feeds.feedburner.com/theifworks"/>
          <outline type="rss" text="dean.edwards.name/weblog" title="dean.edwards.name/weblog" xmlUrl="http://feeds.feedburner.com/deanedwards/weblog"/>
          <outline type="rss" text="Perfection Kills" title="Perfection Kills" xmlUrl="http://feeds.feedburner.com/PerfectionKills"/>
          <outline type="rss" text="mrale.ph" title="mrale.ph" xmlUrl="http://mrale.ph/atom.xml"/>
          <outline type="rss" text="Stories by TJ Holowaychuk on Medium" title="Stories by TJ Holowaychuk on Medium" xmlUrl="https://medium.com/feed/@tjholowaychuk"/>
          <outline type="rss" text="Andreas Gal" title="Andreas Gal" xmlUrl="http://andreasgal.com/feed/"/>
          <outline type="rss" text="jQuery UI Blog" title="jQuery UI Blog" xmlUrl="http://feeds2.feedburner.com/jquery-ui"/>
          <outline type="rss" text="Pony Foo" title="Pony Foo" xmlUrl="https://ponyfoo.com/articles/feed"/>
          <outline type="rss" text="visophyte: shiny? shiny." title="visophyte: shiny? shiny." xmlUrl="http://www.visophyte.org/blog/feed/atom/"/>
          <outline type="rss" text="Mislav's blog" title="Mislav's blog" xmlUrl="http://feeds.feedburner.com/mislav/dev"/>
          <outline type="rss" text="Mirthful Snowflake" title="Mirthful Snowflake" xmlUrl="http://blog.fallingsnow.net/feed/"/>
          <outline type="rss" text="Comments on" title="Comments on" xmlUrl="http://blog.mozilla.com/faaborg/feed/atom/"/>
          <outline type="rss" text="Research" title="Research" xmlUrl="http://blog.aggregateknowledge.com/feed/"/>
          <outline type="rss" text="Joe Hewitt" title="Joe Hewitt" xmlUrl="http://www.joehewitt.com/index.xml"/>
          <outline type="rss" text="Headius" title="Headius" xmlUrl="http://blog.headius.com/feeds/posts/default"/>
          <outline type="rss" text="Modern SQL" title="Modern SQL" xmlUrl="http://modern-sql.com/feed"/>
          <outline type="rss" text="Bruce Momjian: Postgres Blog" title="Bruce Momjian: Postgres Blog" xmlUrl="http://momjian.us/main/rss/pgblog.xml"/>
          <outline type="rss" text="select * from depesz;" title="select * from depesz;" xmlUrl="http://feeds.feedburner.com/depesz"/>
          <outline type="rss" text="malisper.me" title="malisper.me" xmlUrl="http://malisper.me/feed/"/>
          <outline type="rss" text="Michael Paquier - Open source developer based in Japan - PostgreSQL" title="Michael Paquier - Open source developer based in Japan - PostgreSQL" xmlUrl="http://michael.otacoo.com/feeds/postgresql.xml"/>
          <outline type="rss" text="Deep Focus Technologies" title="Deep Focus Technologies" xmlUrl="http://deepfocustech.com/feed"/>
          <outline type="rss" text="Coding Horror" title="Coding Horror" xmlUrl="http://feeds.feedburner.com/codinghorror/"/>
          <outline type="rss" text="Aza on Design" title="Aza on Design" xmlUrl="http://www.azarask.in/blog/feed/"/>
          <outline type="rss" text="Paul Irish" title="Paul Irish" xmlUrl="http://paulirish.com/feed/"/>
          <outline type="rss" text="Lost Garden" title="Lost Garden" xmlUrl="http://www.lostgarden.com/feeds/posts/default"/>
          <outline type="rss" text="CreativeJS" title="CreativeJS" xmlUrl="http://creativejs.com/feed/"/>
          <outline type="rss" text="Soulwire" title="Soulwire" xmlUrl="http://blog.soulwire.co.uk/feed"/>
          <outline type="rss" text="simurai" title="simurai" xmlUrl="http://simurai.com/rss"/>
          <outline type="rss" text="Big elephants" title="Big elephants" xmlUrl="http://big-elephants.com/atom.xml"/>
        </outline>
        <outline text="Ruby">
          <outline type="rss" text="ones zeros majors and minors" title="ones zeros majors and minors" xmlUrl="http://feeds.feedburner.com/ozmmorg"/>
          <outline type="rss" text="The Buckblog" title="The Buckblog" xmlUrl="http://feeds.feedburner.com/buckblog"/>
          <outline type="rss" text="snax" title="snax" xmlUrl="http://feeds.feedburner.com/snax"/>
          <outline type="rss" text="@tmm1" title="@tmm1" xmlUrl="http://tmm1.net/atom.xml"/>
          <outline type="rss" text="Ruby Inside" title="Ruby Inside" xmlUrl="http://www.rubyinside.com/feed/"/>
          <outline type="rss" text="Ruby Best Practices" title="Ruby Best Practices" xmlUrl="http://feeds2.feedburner.com/RubyBestPractices"/>
          <outline type="rss" text="Rails Inside" title="Rails Inside" xmlUrl="http://feeds.feedburner.com/RailsInside"/>
          <outline type="rss" text="RailsCasts" title="RailsCasts" xmlUrl="http://feeds.feedburner.com/railscasts"/>
          <outline type="rss" text="Dr Nic" title="Dr Nic" xmlUrl="http://feeds.feedburner.com/DrNic"/>
          <outline type="rss" text="Ruby News" title="Ruby News" xmlUrl="http://www.ruby-lang.org/en/feeds/news.rss"/>
          <outline type="rss" text="antirez weblog" title="antirez weblog" xmlUrl="http://feeds.feedburner.com/antirez"/>
          <outline type="rss" text="Giant Robots Smashing Into Other Giant Robots" title="Giant Robots Smashing Into Other Giant Robots" xmlUrl="http://feeds.feedburner.com/GiantRobotsSmashingIntoOtherGiantRobots"/>
          <outline type="rss" text="igvita.com" title="igvita.com" xmlUrl="http://feeds.feedburner.com/igvita"/>
          <outline type="rss" text="RailsTips by John Nunemaker" title="RailsTips by John Nunemaker" xmlUrl="http://feeds.feedburner.com/railstips"/>
          <outline type="rss" text="Ruby Quicktips" title="Ruby Quicktips" xmlUrl="http://feeds.feedburner.com/RubyQuicktips"/>
          <outline type="rss" text="example.com" title="example.com" xmlUrl="http://blog.zenspider.com/atom.xml"/>
          <outline type="rss" text="GitHub Engineering" title="GitHub Engineering" xmlUrl="http://githubengineering.com/atom.xml"/>
          <outline type="rss" text="The timeless repository" title="The timeless repository" xmlUrl="http://feeds.feedburner.com/MagnusHolm"/>
          <outline type="rss" text="Marc-Andre Cournoyer's Awesome Feed" title="Marc-Andre Cournoyer's Awesome Feed" xmlUrl="http://macournoyer.com/blog.atom"/>
          <outline type="rss" text="Mike Perham" title="Mike Perham" xmlUrl="http://feeds2.feedburner.com/mikeperham"/>
          <outline type="rss" text="oldmoe" title="oldmoe" xmlUrl="http://oldmoe.blogspot.com/feeds/posts/default"/>
          <outline type="rss" text="Ryan Tomayko's Writings" title="Ryan Tomayko's Writings" xmlUrl="http://tomayko.com/writings/feed"/>
          <outline type="rss" text="time to bleed by Joe Damato" title="time to bleed by Joe Damato" xmlUrl="http://feeds.feedburner.com/TimeToBleed"/>
        </outline>
        <outline text="Web Dev">
          <outline type="rss" text="A List Apart: The Full Feed" title="A List Apart: The Full Feed" xmlUrl="http://alistapart.com/rss.xml"/>
          <outline type="rss" text="UX Movement" title="UX Movement" xmlUrl="http://feeds.feedburner.com/uxmovement"/>
          <outline type="rss" text="The Usability Post" title="The Usability Post" xmlUrl="http://feeds.feedburner.com/usabilitypost"/>
          <outline type="rss" text="iA News Feed" title="iA News Feed" xmlUrl="http://www.informationarchitects.jp/feed/"/>
          <outline type="rss" text="Art of the Menu" title="Art of the Menu" xmlUrl="http://feeds.feedburner.com/ucllc/artofthemenu"/>
          <outline type="rss" text="Book Worship™" title="Book Worship™" xmlUrl="http://bookworship.com/?feed=rss2"/>
          <outline type="rss" text="Montague Projects Blog" title="Montague Projects Blog" xmlUrl="http://montagueprojectsblog.blogspot.com/feeds/posts/default"/>
          <outline type="rss" text="WPOStats.com" title="WPOStats.com" xmlUrl="http://wpostats.com/feed.xml"/>
          <outline type="rss" text="Product Habits" title="Product Habits" xmlUrl="https://producthabits.com/feed/"/>
        </outline>
        <outline text="Tertiary">
          <outline type="rss" text="I Love Typography" title="I Love Typography" xmlUrl="http://feeds.feedburner.com/ILoveTypography"/>
          <outline type="rss" text="Futility Closet" title="Futility Closet" xmlUrl="http://feeds.feedburner.com/FutilityCloset"/>
          <outline type="rss" text="Ascii Dreams" title="Ascii Dreams" xmlUrl="http://feeds.feedburner.com/AsciiDreams"/>
          <outline type="rss" text="Wallyhood" title="Wallyhood" xmlUrl="http://feeds2.feedburner.com/Wallyhood"/>
        </outline>
        <outline type="rss" text="Code inComplete" title="Code inComplete" xmlUrl="http://feeds.feedburner.com/codeincomplete"/>
        <outline type="rss" text="Monkey and Crow" title="Monkey and Crow" xmlUrl="http://feeds.feedburner.com/MonkeyAndCrow?format=xml"/>
        <outline type="rss" text="Stories by Kayvon Ghaffari on Medium" title="Stories by Kayvon Ghaffari on Medium" xmlUrl="https://medium.com/feed/@ThusSpokeKayvon"/>
      </outline>
    </body>
  </opml>
  `

  return importOpml(xml)
}