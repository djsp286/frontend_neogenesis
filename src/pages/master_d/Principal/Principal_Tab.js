import Page from 'components/Page';
import {
    Card, CardHeader, Col, Row
} from 'reactstrap';
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Principal_DataPrincipal from './Principal_DataPrincipal';
import Principal_DataFakturPajak from './Principal_DataFakturPajak';
import Principal_ProdukList from './Principal_ProdukList';
import Principal_Finance from './Principal_Finance';

class Principal_Tab extends React.Component {

    constructor(props) {
        super(props);
        this.state  = {
            result          : [],
            activeItemId    : this.props.activeItemId,
            groupStatus     : this.props.groupStatus,
            activeItemName  : '',
            
        };
    }
    
    connectionOut(message, render){
        console.log("masuk");
        if(render){
            this.setState({
                modal_response      : true,
                responseHeader      : "CONNECTION ERROR",
                responseMessage     : message
            },  () => this.componentDidMount())
        }else{
            this.setState({
                modal_response      : true,
                responseHeader      : "CONNECTION ERROR",
                responseMessage     : message
            })
        }
    }

    state = {
        modal_response     : false,
        responseHeader     : "",
        responseMessage    : "",
    };

    render(){
        return(
            <Page>
            <Row  style={{
                            display: this.state.displayPage
                        }}>
                    <Col>
                       
                
                               
                < Tabs
                                selectedIndex={this.state.selectedTabs}
                                style={{
                                    display: this.state.displayTabs,
                                }}>

                                    <TabList
                                    tabIndex={0}>
                                        <Tab>Data Principal</Tab>
                                        {this.state.activeItemId == -1 
                                        ?
                                        <Tab disabled>Data Faktur Pajak</Tab>
                                        :
                                        <Tab>Data Faktur Pajak</Tab>
                                        }

                                        {this.state.activeItemId == -1 
                                        ?
                                        <Tab disabled>Produk List</Tab>
                                        :
                                        <Tab>Produk List</Tab>
                                        }

                                        {this.state.activeItemId == -1 
                                        ?
                                        <Tab disabled>Finance</Tab>
                                        :
                                        <Tab>Finance</Tab>
                                        }
                                    </TabList>
                                
                                    <TabPanel>
                                        <Principal_DataPrincipal  func = {()=>this.props.func()} groupId={this.state.groupId} activeItemId={this.state.activeItemId} groupStatus={this.state.groupStatus} />
                                    </TabPanel>

                                    <TabPanel>
                                        <Principal_DataFakturPajak func = {()=>this.props.func()} groupId={this.state.groupId} activeItemId={this.state.activeItemId} groupStatus={this.state.groupStatus}/>
                                    </TabPanel>
                    
                                    <TabPanel>
                                        <Principal_ProdukList func = {()=>this.props.func()}groupId={this.state.groupId} activeItemId={this.state.activeItemId} groupStatus={this.state.groupStatus}/>
                                    </TabPanel>

                                    <TabPanel>
                                        <Principal_Finance func = {()=>this.props.func()}groupId={this.state.groupId} activeItemId={this.state.activeItemId} groupStatus={this.state.groupStatus}/>
                                    </TabPanel>
                                </Tabs>
                               
                    </Col>
            </Row>
            </Page>
        )
    }
}
export default Principal_Tab;