import Page from 'components/Page';
import {
    Card, CardHeader, Col, Row
} from 'reactstrap';
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import Supplier_DataSupplier from './Supplier_DataSupplier';
import Supplier_Finance from './Supplier_Finance';
import Supplier_Purchasing from './Supplier_Purchasing';
import Supplier_History from './Supplier_History';
import Supplier_ProductList from './Supplier_ProductList';
import Supplier_Payment from './Supplier_Payment';
import Supplier_FakturPajak from './Supplier_FakturPajak';
import Supplier_BillingDisc from './Supplier_BilingDisc';

class Supplier_Tab extends React.Component {

    constructor(props) {
        super(props);
        this.state  = {
            result          : [],
            activeItemId    : this.props.activeItemId,
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
                                        <Tab>Data Supplier</Tab>
                                        {this.state.activeItemId == -1 
                                        ?
                                        <Tab disabled>Finance</Tab>
                                        :
                                        <Tab>Finance</Tab>
                                        }

                                        {this.state.activeItemId == -1 
                                        ?
                                        <Tab disabled>Purchasing</Tab>
                                        :
                                        <Tab>Purchasing</Tab>
                                        }       

                                        {this.state.activeItemId == -1 
                                        ?
                                        <Tab disabled>History</Tab>
                                        :
                                        <Tab>History</Tab>
                                        }

                                        {this.state.activeItemId == -1 
                                        ?
                                        <Tab disabled>Product List</Tab>
                                        :
                                        <Tab>Product List</Tab>
                                        }  

                                        {this.state.activeItemId == -1 
                                        ?
                                        <Tab disabled>Payment</Tab>
                                        :
                                        <Tab>Payment</Tab>
                                        }  

                                        {this.state.activeItemId == -1 
                                        ?
                                        <Tab disabled>Faktur Pajak</Tab>
                                        :
                                        <Tab>Faktur Pajak</Tab>
                                        }  

                                        {this.state.activeItemId == -1 
                                        ?
                                        <Tab disabled>Billing Discount</Tab>
                                        :
                                        <Tab>Billing Discount</Tab>
                                        }  

                                    
                                    </TabList>

                                    <TabPanel>
                                        <Supplier_DataSupplier func = {()=>this.props.func()} groupId={this.state.groupId} activeItemId={this.state.activeItemId}/>
                                    </TabPanel>

                                    <TabPanel>
                                        <Supplier_Finance func = {()=>this.props.func()} groupId={this.state.groupId} activeItemId={this.state.activeItemId}/>
                                    </TabPanel>

                                    <TabPanel>
                                        <Supplier_Purchasing func = {()=>this.props.func()} groupId={this.state.groupId} activeItemId={this.state.activeItemId}/>
                                    </TabPanel>

                                    <TabPanel>
                                        <Supplier_History func = {()=>this.props.func()} groupId={this.state.groupId} activeItemId={this.state.activeItemId}/>
                                    </TabPanel>

                                    <TabPanel>
                                        <Supplier_ProductList func = {()=>this.props.func()} groupId={this.state.groupId} activeItemId={this.state.activeItemId}/>
                                    </TabPanel>

                                    <TabPanel>
                                        <Supplier_Payment func = {()=>this.props.func()} groupId={this.state.groupId} activeItemId={this.state.activeItemId}/>
                                    </TabPanel>

                                    <TabPanel>
                                        <Supplier_FakturPajak func = {()=>this.props.func()} groupId={this.state.groupId} activeItemId={this.state.activeItemId}/>
                                    </TabPanel>

                                    <TabPanel>
                                        <Supplier_BillingDisc func = {()=>this.props.func()} groupId={this.state.groupId} activeItemId={this.state.activeItemId}/>
                                    </TabPanel>

                                    
                                </Tabs>
                               
                    </Col>
            </Row>
            </Page>
        )
    }
}
export default Supplier_Tab;