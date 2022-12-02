
import React from 'react';
import axios from 'axios';
import { Button, List, Skeleton, Input } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import FlagIcon from './FlagIcon';
import { dateOffsetFromToday, formatDateRange } from '../../lib/dateutils';
import './CompetitionList.less'

const { Search } = Input;


class CompetitionListContainer extends React.Component {
  state = {
    has_search: false,
    loading: false,
    searchResults: [],
    andMore: 0,
    currentComps: []
  }

  constructor(props) {
    super(props);

  }

  setSearchResults(list, andMore, has_search) {   
    this.setState({
      searchResults: list===null ? this.state.list : list,
      andMore: andMore===null ? this.state.andMore : andMore,
      has_search: has_search===null ? this.state.has_search : has_search 
    });
  }

  setCurrentComps(list) {
    this.setState({
      currentComps: list
    });
  }

  render() {
    const setSearchResults = (list, andMore, has_search) => {this.setSearchResults(list, andMore, has_search)};
    const setCurrentComps = (list) => {this.setCurrentComps(list)};

    return (      
      <>
        <h1>Search</h1>      
        <SearchBox setSearchResults={setSearchResults}></SearchBox>  
        {this.state.has_search ? <CompSearchList list={this.state.searchResults}></CompSearchList> : null}
        {this.state.andMore>0 ? <div>and {this.state.andMore} more...</div> : null}
        <br/><br/>
        <h1>Current</h1>
        <CurrentCompetitionList list={this.state.currentComps} setCurrentComps={setCurrentComps}></CurrentCompetitionList>
      </>
    );
  }
} 

class SearchBox extends React.Component {
  state = {
    has_search: false,
    loading: false,
  }

  constructor(props) {
    super(props);

    this.setSearchResults = props.setSearchResults;

    this.baseURL = process.env.REACT_APP_WCA_API_URL;
    this.competitionsURL = this.baseURL + '/competitions'

    this.searchAbortController = new AbortController();
  }
  
  search(searchQuery) {
    this.cancelActiveSearch();
    let searching = false;

    if (searchQuery) {
      searching = true;      
      const searchURL = this.competitionsURL + "?q=" + searchQuery;
      axios.get(searchURL, {signal: this.searchAbortController.signal})
        .then(response => {
          const data = response.data;
          const total = response.headers["total"];
          const count = data.length;
          const and_more = total - count;
          return {list: data, and_more: and_more};
        })
        .then(data => {
          const {list, and_more} = data;
          this.setState({loading: false});
          this.setSearchResults(list, and_more, true);
        })
        .catch((err) => {
          if (err.code !== "ERR_CANCELED") {
            console.error(`Download error: ${err.message}`);
          }
        });;
    } else {
      this.setSearchResults([], 0, false);
    }

    this.setState({loading: searching})
  }

  cancelActiveSearch() {
    if (this.searchAbortController) {
      this.searchAbortController.abort();
      this.searchAbortController = new AbortController();
    }
  }

  render() {
    const handleSearch = (e) => this.search(e.target.value);

    return <>
      <Search placeholder="Search" loading={this.state.loading} enterButton onChange={handleSearch}></Search>
    </>
  }
}


class BaseCompetitionList extends React.Component {
  state = {
    data: [],
    more_url: "",
    per_page: 0,
    total: 0,
    busy: true
  }

  constructor(props) {
    super(props);

    this.baseURL = process.env.REACT_APP_WCA_API_URL;
    this.competitionsURL = this.baseURL + '/competitions'

    this.show_list = true;

    this.setCurrentComps = props.setCurrentComps;
  }

  componentDidMount() {
    this.getMore();
  }

  getMore() {
    if (this.state.more_url) {
      this.setState({busy: true});
      axios.get(this.state.more_url)
      .then(response => {
        let link_urls_temp = response.headers["link"];
        
        let link_urls = parseLinks(link_urls_temp);

        if (link_urls["next"]) {
          this.setState({more_url: link_urls["next"], total: response.headers["total"]});
        } else {
          this.setState({more_url: "", total: response.headers["total"]});
        }

        return response.data;
      })
      .then(data => {
        data = this.props.list.concat(data);
        this.setCurrentComps(data);
        this.setState({busy: false})
      })
      .catch(err => {
        console.error(err.message)
      });
    } else {
      this.setState({busy: false});
    }

  }

  render() {
    const handleLoadMore = (e) => {
      this.getMore();
    };

    return <>
      {this.show_list ? <List
        className="competition-list"
        loading={this.state.busy}
        bordered={true}
        itemLayout="horizontal"
        size="small"
        split={true}
        loadMore={this.state.more_url && this.state.total ? <List.Item><Button onClick={handleLoadMore}>Load more <EllipsisOutlined /></Button></List.Item> : null}
        dataSource={this.props.list}
        renderItem={(comp) => (
          <Link to={`/competition/${comp.id}`} className='comp-list-item'><List.Item>
            <Skeleton title={false} loading={comp.loading} active>
              <List.Item.Meta
                avatar={<FlagIcon code={comp.country_iso2.toLowerCase()} size="lg" className='comp-flag'></FlagIcon>}
                title={comp.short_name}
                description={formatDateRange(comp.start_date, comp.end_date)}
              />
            </Skeleton>
          </List.Item></Link>
        )}
      /> : null}
    </>
  }
}


class CurrentCompetitionList extends BaseCompetitionList {
  constructor(props) {
    super(props);
    const start = dateOffsetFromToday(-7);
    const end = dateOffsetFromToday(0);

    const params = {
      start: start,
      end: end
    }
    
    const url = this.competitionsURL + '?' + new URLSearchParams(params).toString();
    this.state.more_url = url;
  }
}


class CompSearchList extends BaseCompetitionList {

  constructor(props) {
    super(props);
  }

}



function parseLinks(linksStr) {
  if (linksStr.length == 0) {
    return [];
  }

  // Split parts by comma
  var parts = linksStr.split(',');
  var links = {};
  // Parse each part into a named link
  for(var i=0; i<parts.length; i++) {
    var section = parts[i].split(';');
    if (section.length !== 2) {
        throw new Error("section could not be split on ';'");
    }
    var url = section[0].replace(/<(.*)>/, '$1').trim();
    var name = section[1].replace(/rel="(.*)"/, '$1').trim();
    links[name] = url;
  }
  return links;
}

export default CompetitionListContainer;
