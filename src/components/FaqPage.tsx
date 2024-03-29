import React from 'react';
import { Header } from 'semantic-ui-react';
import styled from 'styled-components';

interface QuestionProps {
  title: string;
  children: React.ReactNode;
}

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  font-size: 18px;
  color: rgba(37, 37, 37, 0.7);
  padding-bottom: 100px;

  & pre {
    background: rgba(237, 237, 237, 0.5);
    padding: 8px;
    border-radius: 8px;
  }
`;

const Question = ({ title, children }: QuestionProps) => (
  <>
    <Header as="h3" variant="large">
      {title}
    </Header>

    <p>{children}</p>
  </>
);

const FaqPage = () => {
  return (
    <Wrapper>
      <Header as="h2" variant="huge">
        FAQ
      </Header>

      <Question title="Why can't I edit a wanderer's attributes, perks or cost?">
        <p>
          Wanderers in Bannerlord are not <i>true</i> companions like like in in Warband). Instead, they are auto
          generated from a template and some values are randomized.
        </p>
        <p>
          Attributes and perk points are assigned randomly based on the combined skill points of the template, while the
          cost of hiring them is based on the gear they wear.
        </p>
      </Question>

      <Question title="What are the files in the mod? Why is there a .dll in there?">
        <p>These are the files generated by the mod:</p>
        <pre>
          {`zzCreatedMod.zip
├── bin/
|   └── Win64_Shipping_Client/
│       └── WandererStringsLoader.dll
├── ModuleData
│   ├── spspecialcharacters_zzcreatedmod.xml
│   ├── wanderer_strings_zzcreatedmod.xml
│   └── xml_attributes_to_be_identified.txt
└── SubModule.xml`}
        </pre>
        <ul>
          <li>
            <b>WandererStringsLoader.dll</b> contains a super simple script for loading the dialogue contained in the
            wander_strings.xml file. Without it, the wanderers will not have any dialogue when you talk to them in the
            tavern, but leaving it out will not break anything else.{' '}
            <a
              href="https://github.com/duniul/bannerlord-wanderer-strings-loader"
              target="_blank"
              rel="noopener noreferrer"
            >
              You can find the source code for it here!
            </a>
          </li>
          <li>
            <b>spspecialcharacters_*.xml</b> contains the character templates for the wanders you created.
          </li>
          <li>
            <b>wanderer_strings_*.xml</b> contains the wanderer's introduction dialogue for when you first meet them in
            a tavern. Requires the .dll file to load.
          </li>
          <li>
            <b>xml_attributes_to_be_identified.txt</b> simply the xml files with the type of data they contain.
          </li>
          <li>
            <b>SubModule.xml</b> is the module declaration file and is necessary to load the mod at all.
          </li>
        </ul>
      </Question>

      <Question title="Why does it add 'zz' in front of the file name?">
        <p>
          This is done to ensure that the mod is placed below the official modules it depends on, which ensures that it
          loads later than them.
        </p>
      </Question>

      <Question title="My wanderers are not in the encyclopedia. Where are they?">
        <ul>
          <li>
            If you have started a new campaign and are using a mod like Unlimited Wanderers, then the mod probably isn't
            installed correctly.
          </li>
          <li>
            If you have started a new campaign without an unlimited wanderers mod, then there is a risk that other
            wanderers were loaded instead of yours.
          </li>
          <li>
            If you haven't started a new campaign then you might need to wait longer in-game until a new set of
            wanderers are loaded into the game.
          </li>
          <li>My wanderers show up in the encyclopedia, but not in the city it says they are in. Where are they?</li>
        </ul>
      </Question>

      <Question title="My wanderers show up in the encyclopedia, but not in the city it says they are in. Where are they?">
        The location mentioned in the encyclopedia isn't trustworthy, and almost always wrong. If they are in the
        encyclopedia then they have been loaded into the game, which means that they will show up in a city at some
        point.
      </Question>
    </Wrapper>
  );
};

export default FaqPage;
