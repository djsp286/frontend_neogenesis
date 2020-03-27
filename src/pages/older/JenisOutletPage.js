import Page from 'components/Page';
import SearchInput from 'components/SearchInput';
import React from 'react';
import {
    Button, Badge, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, Label
} from 'reactstrap';
import { MdHighlightOff, MdCheckCircle } from 'react-icons/md';

class JenisOutletPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            isLoading: false,
            inputtedName: ''
        };
    }

    componentDidMount() {
        this.setState({ isLoading: true });
        fetch('http://pharmanet.apodoc.id/neogenesisViewMasterJenisOutlet.php')
            .then(response => response.json())
            .then(data => this.setState({ result: data.result, isLoading: false }));
        this.toggle('nested_parent')
    }

    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested: false,
        backdrop: true,
    };

    toggle = modalType => () => {
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal,
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        });
    };

    render() {
        const { result } = this.state;

        console.log(result)

        return (
            <Page
                title="Jenis Outlet"
                breadcrumbs={[{ name: 'jenis outlet', active: true }]}
                className="JenisOutletPage"
            >
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <CardHeader className="d-flex justify-content-between">
                                <SearchInput />
                                <Button size="sm" onClick={this.toggle('nested_parent')}>Tambah</Button>
                                <Modal
                                    isOpen={this.state.modal_nested_parent}
                                    toggle={this.toggle('nested_parent')}
                                    className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('nested_parent')}>
                                        Tambah Jenis Outlet
                                </ModalHeader>
                                    <ModalBody>
                                        <Label>Nama Jenis Outlet</Label>
                                        <Input type="namajenisoutlet" value={this.state.inputtedName} onChange={evt => this.updateInputValue(evt)} name="namajenisoutlet" placeholder="Nama Jenis Outlet" />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.toggle('nested')}>
                                            Simpan
                                        </Button>
                                        <Modal
                                            isOpen={this.state.modal_nested}
                                            toggle={this.toggle('nested')}>
                                            <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                                            <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
                                            <ModalFooter>
                                                <Button color="primary">
                                                    Ya
                                            </Button>{' '}
                                                <Button
                                                    color="secondary"
                                                    onClick={this.toggle('nested')}>
                                                    Tidak
                                            </Button>
                                            </ModalFooter>
                                        </Modal>
                                        {' '}
                                        <Button color="secondary" onClick={this.toggle('nested_parent')}>
                                            Batal
                                    </Button>
                                    </ModalFooter>
                                </Modal>
                            </CardHeader>
                            <CardBody>
                                <Table responsive>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Nama Jenis Outlet</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {result.map(jnsout =>
                                            <tr>
                                                <th scope="row">{jnsout.jnsout_code}
                                                </th>
                                                <td>{jnsout.jnsout_name}</td>
                                                <td>
                                                    {jnsout.jnsout_activeyn === "Y" &&
                                                        <Badge color="success" className="mr-1">Aktif</Badge>
                                                    }
                                                    {jnsout.jnsout_activeyn !== "Y" &&
                                                        <Badge color="danger" className="mr-1">Tidak Aktif</Badge>
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        jnsout.jnsout_activeyn === "Y"
                                                        &&
                                                        <Button color="danger" size="sm" onClick={this.toggle('backdrop')}><MdHighlightOff /></Button>
                                                    }
                                                    {
                                                        jnsout.jnsout_activeyn !== "Y"
                                                        &&
                                                        <Button color="success" size="sm" onClick={this.toggle('backdrop')}><MdCheckCircle /></Button>
                                                    }
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Page>
        );
    }

    updateInputValue(evt) {
        this.setState({
            inputtedName: evt.target.value
        });
    }

}
export default JenisOutletPage;
