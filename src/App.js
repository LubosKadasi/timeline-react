import React, { useEffect, useState } from "react";
import ScrollObserver from "./components/ScrollObserver";
import ThemeSwitch from './components/ThemeSwitch';

const App = () => {
  const [visibleSection, setVisibleSection] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [jsonData, setJsonData] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const param = searchParams.get("future");
    var url = './demo-data/demo/data.json';
    if (param) {
      // Fetch data from custom folder
      url = './custom-data/' + encodeURIComponent(param) + '/data.json';
    };
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setJsonData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Scroll to init section
  useEffect(() => {
    if (jsonData) {
      const defaultNode = jsonData.sections.find(node => node.hasOwnProperty("scrollTo"));
      if (defaultNode) {
        const element = document.getElementById(defaultNode.id);
        element.scrollIntoView();
      }}
    }
  , [jsonData]);

  const handleThemeToggle = (isChecked) => {
    setDarkMode(isChecked);
    document.documentElement.style.setProperty(
      '--primary-color',
      isChecked ? '#fff' : '#000'
    );
    document.documentElement.style.setProperty(
      '--secondary-color',
      isChecked ? '#000' : '#fff'
    );
  };

  const handleSectionVisible = (sectionId) => {
    setVisibleSection(sectionId);
  };
  
  const extractIdsFromContent = (content) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    const elementsWithIds = doc.querySelectorAll("[id]");
    const uniqueIds = Array.from(elementsWithIds).map((element) => element.id);
    return uniqueIds;
  };

  if (!jsonData || !jsonData.sections) {
    return <div>...</div>;
  }
  
  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>

      <nav className="nav">
        {jsonData.sections.map((section) => (
          section.id && (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={visibleSection === section.id ? "in-view" : ""}
              dangerouslySetInnerHTML={{ __html: section.title || "" }}
            />
          )
        ))}
        <a className="toggle-tags" href="#tags">#</a>
      </nav>

      <main className="main">
        {jsonData.sections.map((section) => (
          <section key={section.id} id={section.id} className={section.class}>
            <article>
              <ScrollObserver sectionId={section.id} onVisible={handleSectionVisible} />
              <h2 dangerouslySetInnerHTML={{ __html: section.title || "" }} />
              <div dangerouslySetInnerHTML={{ __html: (Array.isArray(section.content) ? section.content.join('') : section.content ) || "" }} />
            </article>
          </section>
        ))}
      </main>

      <aside className="aside" id="tags">
        <nav>
            {jsonData.sections.map((section) => (
              section.content && extractIdsFromContent(section.content).map((id) => (
                <a key={id} href={`#${id}`}>
                    {id}
                  </a>
                ))
            ))}
        </nav>
      </aside>
      <div className="fg-shadow"></div>

      <aside className="overlay-tools overlay-tools--right">
        <ThemeSwitch onToggle={handleThemeToggle} />
      </aside>

      <aside className="overlay-tools overlay-tools--left">
        <a className="github" href="https://github.com/LubosKadasi/" target="_blank" rel="noreferrer">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--secondary-color)"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
        </a>
      </aside>

    </div>
  );
};

export default App;