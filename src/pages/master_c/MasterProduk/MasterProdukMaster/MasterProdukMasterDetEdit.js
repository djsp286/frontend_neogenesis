import React from 'react';
import {
  Button, Form, Label, Table,
  Input, FormGroup, Card, CardBody
} from 'reactstrap';
import {MdSave, MdCancel
} from 'react-icons/md';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import MasterProdukMasterViewEdit from './MasterProdukMasterViewEdit';
import MasterProdukSupplierAktif from '../MasterProdukSupplierAktif/MasterProdukSupplierAktif';
import MasterProdukKarakteristikProduk from '../MasterProdukKarakteristikProduk';
import MasterProdukHistorySupplier from '../MasterProdukHistorySupplier';
import MasterProdukProgramDiscount from '../MasterProdukProgramDiscount';
import MasterProdukStockAndSales from '../MasterProdukStockAndSales';
import MasterProdukHistoryProduct from '../MasterProdukHistoryProduct';
import MasterProdukSick from '../MasterProdukSick';


class MasterProdukMasterDetEdit extends React.Component {

    constructor(props){
        super(props);
        this.state={
            activeProcode: this.props.activeProcode
        }
    }

    // componentWillReceiveProps(activeProcode){
    //     this.setState({
    //         activeProcode:activeProcode
    //     })
    // }

    // componentDidMount(){
    //     console.log(this.props.activeProcode);
    // }

    returnToHomePage = () => {
        this.setState({
            selectedTab: 0,
        })
    } 

    render() {

        return (

            <div >
                <Card>
                    <CardBody>
                        
                        <Tabs>
                            
                            <TabList>
                                <Tab onClick={ () => { this.setState({ selectedTab: 0 })} }>MASTER</Tab>
                                <Tab onClick={ () => { this.setState({ selectedTab: 1 })} }>SUPPLIER AKTIF</Tab>
                                <Tab onClick={ () => { this.setState({ selectedTab: 2 })} }>KARAKTERISTIK PRODUK</Tab>
                                <Tab onClick={ () => { this.setState({ selectedTab: 3 })} }>HISTORY SUPPLIER</Tab>
                                <Tab onClick={ () => { this.setState({ selectedTab: 4 })} }>PROGRAM DISCOUNT</Tab>
                                <Tab onClick={ () => { this.setState({ selectedTab: 5 })} }>STOCK & SALES</Tab>
                                <Tab onClick={ () => { this.setState({ selectedTab: 6 })} }>HISTORY PRODUCT</Tab>
                                <Tab onClick={ () => { this.setState({ selectedTab: 7 })} }>SICK</Tab>
                            </TabList>
                            
                            <TabPanel>
                                <MasterProdukMasterViewEdit 
                                activeProcode={this.state.activeProcode}
                                />
                            </TabPanel>

                            <TabPanel>
                                <MasterProdukSupplierAktif
                                func={ () => this.returnToHomePage() }
                                activeProcode={ this.state.activeProcode }
                                />
                            </TabPanel>

                            <TabPanel>
                                <MasterProdukKarakteristikProduk/>
                            </TabPanel>

                            <TabPanel>
                                <MasterProdukHistorySupplier/>
                            </TabPanel>

                            <TabPanel>
                                <MasterProdukProgramDiscount/>
                            </TabPanel>

                            <TabPanel>
                                <MasterProdukStockAndSales/>
                            </TabPanel>

                            <TabPanel>
                                <MasterProdukHistoryProduct/>
                            </TabPanel>

                            <TabPanel>
                                <MasterProdukSick/>
                            </TabPanel>

                            <hr/>
                            
                        </Tabs>

                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default MasterProdukMasterDetEdit;