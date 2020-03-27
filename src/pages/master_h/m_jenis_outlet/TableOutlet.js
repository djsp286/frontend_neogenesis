import React from 'react';
import { Input, Table, Pagination, PaginationItem, PaginationLink, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import style from './mystyle.css'


class TableOutlet extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            data: props.data,
            page: -1,
            totalShown:5,
            totalPages: -1,
            modal: false
            
        };
    }

    changeBackdrop(e) {
        let value = e.target.value;
        if (value !== 'static') {
        value = JSON.parse(value);
        }
        this.setState({ backdrop: value });
    }

    componentDidUpdate = (prevProps) => {
        if(this.props.data != prevProps.data){
            this.setState({
                data: this.props.data,
                page: 1,
                totalPages: Math.ceil(this.props.data.length / this.state.totalShown)
            });
        }
    }

    prevPage = () => {
        let nowPage = this.state.page - 1 < 1 ? 1 : this.state.page - 1;
        this.setState({
            page: nowPage
        });
    }

    nextPage = () => {
        let nowPage = this.state.page + 1 > this.state.totalPages ? this.state.totalPages : this.state.page + 1;
        this.setState({
            page: nowPage,
            totalShown : 5,
            totalPages : Math.ceil(this.props.data.length / this.state.totalShown)
        });

        console.log('Page : ' +this.state.page)
        console.log('total show : ' + this.state.totalShown)
        console.log('total pages : ' + this.state.totalPages)
    }
    showAll()
    {
        this.setState(
            {
                totalShown :Math.ceil(this.props.data.length),
                page : 1
               
            })

            console.log('Page : ' +this.state.page)
            console.log('total show : ' + this.state.totalShown)
            console.log('total pages : ' + this.state.totalPages)
            console.log('panjang data : ' + this.props.data.length)
    }
    showFive()
    {
        this.setState({
            totalShown : 5,
            page : 1
            
        });
        console.log('Page : ' +this.state.page)
        console.log('total show : ' + this.state.totalShown)
        console.log('total pages : ' + this.state.totalPages)
        console.log('panjang data : ' + this.props.data.length)
        
       
        
    }


//ini tombol delete yang benar
// <td><Button color="danger" size = "sm"onClick={() => this.props.onItemClick(v.jnsout_Name)}>Delete</Button></td>   




    render()
    {
        let startData = (this.state.page - 1) * this.state.totalShown;
        let endData = this.state.page * this.state.totalShown;
        return(
            <>
                {
                    this.state.data && this.state.data.length > 0 && 
                    <div>
                        <Table hover>
                            <thead >
                                <tr>
                                    <th>NO</th>
                                    <th>Kode Outlet</th>
                                    <th>Nama Jenis Outlet</th>
                                    {!this.props.showAll && <th>Action</th>}
                                </tr>
                            </thead>
                            <tbody>
                             {!this.props.showAll && this.state.data.map((v, i) => 
                                    startData <= i && i < endData &&
                                    <tr key={i}>
                                        <td scope="row" >{i+1}</td>
                                        <td>{v.jnsout_code}</td>
                                        <td>{v.jnsout_name}</td>
                                        <td><Button color="danger" size = "sm"onClick={() => this.props.onItemClick(v.jnsout_name)}>Delete</Button></td>     
                                        
                                    </tr>
                                )}
                                {this.props.showAll && this.state.data.map((v,i) =>
                                    <tr key={i}>
                                    <td scope="row">{i+1}</td>
                                    <td>{v.jnsout_code}</td>
                                    <td>{v.jnsout_name}</td>    
                                </tr>
                                )}                           
                            </tbody>
                        </Table>
                        <div className = "pagination-wrapper">
                            <ul className = "pagination">
                            {!this.props.showAll && <Pagination >
                            <PaginationItem disabled={this.state.page == 1} onClick={() => this.prevPage()}>
                                <PaginationLink >Prev</PaginationLink>
                            </PaginationItem>
                            <PaginationItem disabled = {this.state.totalShown > 5}>
                                <PaginationLink onClick={()=> this.showAll() }>Show All</PaginationLink>
                            </PaginationItem>
                            <PaginationItem disabled ={this.state.totalShown == 5}>
                                <PaginationLink onClick={()=> this.showFive() }>Show 5 Data</PaginationLink>
                            </PaginationItem>
                            <PaginationItem disabled={(this.state.page == this.state.totalPages) || (this.state.totalShown > 5)} >
                                <PaginationLink  onClick={() => this.nextPage()}>Next</PaginationLink>
                            </PaginationItem>                                                      
                        </Pagination>}

                            </ul>
                        </div>
                        
                    </div>
                }
                {
                    (!this.state.data || this.state.data.length < 1) &&
                    <h2 style={{
                        display: 'flex',
                        justifyContent: 'center',
                        margin: '10px'
                    }}>No Data</h2>
                }
            </>
        );
    }
}

export default TableOutlet;