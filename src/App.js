import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import mnist from 'mnist'
import synaptic from 'synaptic'

const set = mnist.set(700, 20)

const trainingSet = set.training
const testSet = set.test

const Layer = synaptic.Layer;
const Network = synaptic.Network;
const Trainer = synaptic.Trainer;

const inputLayer = new Layer(784);
const hiddenLayer = new Layer(100);
const outputLayer = new Layer(10);

inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

const myNetwork = new Network({
    input: inputLayer,
    hidden: [hiddenLayer],
    output: outputLayer
});

const trainer = new Trainer(myNetwork);




class App extends Component {
  constructor(props) {
    super(props)

    this.startTraining = this.startTraining.bind(this)
    this.state = { stop: false }
  }

  startTraining() {
    let self = this
    trainer.trainAsync(trainingSet, {
        rate: .2,
        iterations: 20,
        error: .1,
        shuffle: true,
        log: 1,
        cost: Trainer.cost.CROSS_ENTROPY,
        schedule: {
            every: 1, // repeat this task every 500 iterations
            do: (data) => {
                // custom log
                console.log("data ", data)
                if (self.state.stop)
                    return true; // abort/stop training
            }
          }
        })
    .then(results => console.log('done!', results))


    // console.log(myNetwork.activate(testSet[0].input));
    // console.log(testSet[0].output);
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.startTraining}>Start Training</button>
        <button onClick={() => this.setState({ stop: true })}>STOP training</button>
        <canvas/>
      </div>
    );
  }
}

export default App;
