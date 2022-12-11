import React from 'react';
import PageLayout from '../../layout/PageLayout';
import Latex from 'react-latex';
import { Alert } from 'antd';
import '../../lib/modernizr';
import './About.less'

class About extends React.Component {
  componentDidMount() {
    document.title = "Competition KinchRanks: About"
  }

  render() {
    return (
      <PageLayout title="About" className="dark-theme">
        <div>

          <h1>
            Overview
          </h1>
          <p>
            KinchRanks is a ranking system proposed by Daniel Sheppard on
            the <a href="https://www.speedsolving.com/threads/all-round-rankings-kinchranks.53353/">
              SpeedSolving forums
            </a> in 2015. The goal is to rank all-round cubing ability in a way that weights all events equally. 
            The system works by normalising each result to a value between 0 and 100, with a score of 100 being 
            the best possible score, and a score of zero for a DNF result, or if the person did not compete in that event.          
          </p>
          <p>
            While the system was originally designed to work with world records to get a global ranking (or regional records 
            for regional rankings), it is possible to apply the system to a single competition with a few adjustments.
          </p>



          <h1>
            How to Use
          </h1>
          <p>
            This tool uses the <a href="https://github.com/thewca/wcif">WCA Competition Interchange Format (WCIF)</a>, 
            which is the same system used by <a href="https://live.worldcubeassociation.org">WCA Live</a> and many other tools. 
            The results do need to be synchronised, so if you are an organiser or delegate for a competition, and the 
            results for your competition are not showing up, then make sure you synchronise the results from WCA Live.
          </p>


          <h1>
            Methodology
          </h1>

          <p>
            For each competitor, a score between 0 and 100 is calculated for each event that was held at the competition. 
            The best result that that competitor achieved in any round is taken as their personal best result.
          </p>
          <p>
            <Latex>$K_c$</Latex> is the KinchRank for a competitor <Latex>$c$</Latex>, which is the mean Kinch score across 
            all events,
          </p>  
          <p>
            <Latex>{"$ \\displaystyle K_c = \\frac{1}{N}  \\sum^N_{i=1} K_{c,i}  $"}</Latex>
          </p>
          <p>
            where <Latex>$N$</Latex> is the number of events held at the competition. The individual scores are
            calculated from
          </p>
          <p>
            <Latex>{"$ \\displaystyle K_{c,i} = \\left( \\frac{b_i}{x_{c,i}} \\right) \\times 100 $"}</Latex>
          </p>
          <p>
            where <Latex>$b_i$</Latex> is the best result for event <Latex>$i$</Latex> across all competitors, 
            and <Latex>{"$x_{c,i}$"}</Latex> is the result for competitor <Latex>$c$</Latex> in 
            event <Latex>$i$</Latex>.
            If there is no result, or the result is DNF, then the score <Latex>{"$K_{c,i}$"}</Latex> is set to zero.
            The best result is the minimum result across all <Latex>$M$</Latex> competitors 
            as follows
          </p>
          <p>
            <Latex>{"$ \\displaystyle b_i = \\min \\left( x_{1,i} \\; \\dots \\; x_{M,i} \\right) $"}</Latex>
          </p>
          <p>
            Calculating the result <Latex>{"$x_{c,i}$"}</Latex> depends on the type of event:
          </p>
          <ul>
            <li>
              For fewest moves, and blindfolded events except for multiple blindfolded, two candidate values 
              for <Latex>{"$K_{c,i}$"}</Latex> are calculated. The first is calculated using single results for the value 
              of <Latex>{"$x_{c,i}$"}</Latex> for all competitors, and the second using the the mean result 
              for <Latex>{"$x_{c,i}$"}</Latex>. The highest of the two candidate values for <Latex>{"$K_{c,i}$"}</Latex> is used.
              This is applied seperately for each competitor, so one competitors's score may be calculated using best single results, 
              while another competitor's score may use means. 
            </li>
            <li>
              For fewest moves, the result used is the number of moves, either the best single or mean (chosen as above).
            </li>
            <li>
              For blindfolded events except for multiple blindfolded, the result is the best single or mean 
              time achieved across all rounds (chosen as above).
            </li>
            <li>
              For multiple blindfolded, the result is calculated as follows:
              <div>
                <Latex>{"$ \\displaystyle x_{c,i} = \\left( p_c + 1 - \\frac{t_c}{3600} \\right) ^{-1} $"}</Latex>
              </div>
              where <Latex>{"$p_c$"}</Latex> is the number of points that the competitor achieved (where points is 
              the the number of cubes successfully solved minus the number of cubes that were not 
              correctly solved), and <Latex>{"$t_c$"}</Latex> is the time taken in seconds.            
            </li>
            <li>
              For all other events, the result used is the best average time across all rounds for that event.
              If the competitor failed to achieve an average for any reason (including failing to achieve cutoff), 
              then the there is no result.
            </li>
            <li>
              Where there are multiple possible values for <Latex>{"$x_{c,i}$"}</Latex> (for example, averages 
              across multiple rounds, or multiple attempts for events where a single result can be used), then 
              the best possible value for <Latex>{"$x_{c,i}$"}</Latex> is used.
            </li>
          </ul>
          <p>
            This methodology differs slightly from the original KinchRank proposal in that it rewards getting a 
            mean in 4x4x4 or 5x5x5 blindfolded events. At the time of the original proposal, means for these 
            events were not recognised by the WCA.
          </p>
          <p>
            It also means that a competitor can recieve 0 points for an event that they compete in (for example, 
            if they fail to make the cutoff). While this is unfortunate, it is also a limitation of the original 
            KinchRanks proposal. 
          </p>
          <p>
            If you find any errors or have any suggestions on how to improve the calculation, 
            please <a href="https://github.com/AlphaSheep/Comp-Kinch/issues/new">create a 
            new issue on GitHub</a>.
          </p>

          


        </div>
      </PageLayout>
    );
  }
}

export default About;
