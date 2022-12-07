import React from 'react';
import axios from 'axios';
import { Table, Skeleton, Alert, Typography, Input, Divider } from 'antd';
import { RotateRightOutlined } from '@ant-design/icons';
import getKinchTableFromWCIF from '../../lib/kinchcalc';
import convertOfficialResultsToWCIFlike from '../../lib/wciftool';
import "@cubing/icons";
import EventName from './EventName';
import "./ResultsTable.less"

const { Text } = Typography;
const { Search } = Input;

class ResultsTable extends React.Component {
  state = {
    loading: true,
    comp_data: [],
    results_table: [],
    filter: "",
    columns: [],
    has_result: false,
    complete_results: false,
    error: false
  }

  componentDidMount() {
    this.getData()
  }

  calcAndSetResultState(data) {
    const { has_result, complete, results_table, columns } = getKinchTableFromWCIF(data);
    this.setState({
      loading: false, 
      has_result: has_result,
      complete_results: complete,
      results_table: results_table, 
      columns: columns,
      error: false
    });
  }

  handleFetchError(err) {
    if (err.code !== "ERR_CANCELED") {
      console.error(err.message);
      this.setState({
        error: true
      });
    }
  }

  getData() {
    const baseURL = process.env.REACT_APP_WCA_API_URL;
    const wcifURL = baseURL + `/competitions/${this.props.compid}/wcif/public`;
    const wcaResultURL = baseURL + `/competitions/${this.props.compid}/results`;

    /* 
    We want to prioritise using official WCA results where available, then try WCIF results. 
    We make both requests simultaneously. If the WCA results are not empty, then use those.
    If the WCIF arrives, only use it if there are not official results, and leave the WCA 
    request if it is running.
    */

    axios.get(wcaResultURL)
      .then(response => response.data)
      .then(data => { 
        if (data.length > 0) {
          let comp = convertOfficialResultsToWCIFlike(data);
          this.calcAndSetResultState(comp);
        } 
      })
      .catch(err => this.handleFetchError(err));

    axios.get(wcifURL)
      .then(response => response.data)
      .then(data => {
        this.props.setCompTitle(data.name);
        if (!this.state.has_result) {
          this.calcAndSetResultState(data);
        }
      })
      .catch(err => this.handleFetchError(err));
  }

  formatColumns(columnNames) {
    let columns = [];
    for (let i in columnNames) {
      columns[i] = {
        title: "",
        dataIndex: columnNames[i],
        key: columnNames[i],
        width: 100,
        textWrap: 'word-break',       
      }

      if (columnNames[i] === "rank") {
        columns[i]["title"] = "#";
        columns[i]["width"] = 45;
        columns[i]["fixed"] = "left";
        
      } else if (columnNames[i] === "name") {
        columns[i]["title"] = "Name";
        columns[i]["width"] = 170;
        columns[i]["fixed"] = "left";

      } else if (columnNames[i] === "total") {
        columns[i]["title"] = "Score";
        columns[i]["width"] = 74;
        columns[i]["fixed"] = "left";
        columns[i]["align"] = "center";
        columns[i]["render"] = value => <strong>{(Math.round(value * 10)/10).toFixed(1)}</strong>;

      } else {
        columns[i]["title"] = <EventName eventid={columnNames[i]}/>
        columns[i]["width"] = 70;
        columns[i]["align"] = "center";
        columns[i]["responsive"] = ["sm"];
        columns[i]["render"] = value => {
          if (value == 100) {
            return (<Text type="success">{(Math.round(value * 10)/10).toFixed(1)}</Text>);
          } else if (value===0) {
            return '-';
          } else {
            return value.toFixed(1);
          }
        };
      }
      
    }
    return columns;
  }

  render() {
    const wcaLiveLink = "https://live.worldcubeassociation.org"
    
    const filteredResults = this.state.results_table.filter(value => {
      if (this.state.filter) {
        return value.name.toLowerCase().includes(this.state.filter.toLowerCase())
      } else {
        return true;
      }
    });
    const handleSearch = (e) => this.setState({filter: e.target.value});

    return <>
      {this.state.error ? 
      <Alert
        message="Error"
        description={<span>An error occured when attempting to fetch results.</span>}
        type="error"
        showIcon
      /> : 
      <Skeleton loading={this.state.loading} active>
        {this.state.has_result ? 
          <>
            {this.state.complete_results ? null : <>
              <Alert
                message="Incomplete results"
                description={<span>Some events are missing results. The competition might be ongoing. If you are an organiser or delegate for this competition, 
                  don't forget to synchronise results from <a href={wcaLiveLink}>WCA Live</a></span>}
                type="warning"
                showIcon
              />
              <Divider />
            </>} 
            <>
              <div className='small-screen-warning'>
                <Alert
                  description={<span>Switch to landscape mode for more detail. </span>}
                  type="info"
                  icon={<RotateRightOutlined />}
                  showIcon
                />
                <Divider />
              </div>
              <Search placeholder="Filter competitors" loading={this.state.loading} enterButton onChange={handleSearch}></Search>
              <Divider />
              <Table 
                columns={this.formatColumns(this.state.columns)}
                dataSource={filteredResults} 
                sticky={true}
                scroll={{x: 'max-content'}}
              />
            </>
          </>
            : 
          <Alert
            message="No results"
            description={<span>If you are an organiser or delegate for this competition, 
              don't forget to synchronise results from <a href={wcaLiveLink}>WCA Live</a></span>}
            type="warning"
            showIcon
          />
        }
        
      </Skeleton>}
    </>
  }
}

export default ResultsTable
