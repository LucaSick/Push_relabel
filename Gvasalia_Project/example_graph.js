var s = new sigma({
    renderer: {
        container: document.getElementById("sigma"),
        type: "canvas",
    },
    settings: {
        maxEdgeSize: 5,
    },
});
var graph = {
nodes: [
    {
        id:  's',
        label: 's',
        x: 1,
        y: 1,
        size: 1,
        color: '#EE651D'
    },
    {
        id:  '1',
        label: '1',
        x: 2,
        y: 0,
        size: 1,
        color: '#EE651D'
    },
    {
        id:  '2',
        label: '2',
        x: 3,
        y: 0,
        size: 1,
        color: '#EE651D'
    },
    {
        id:  '3',
        label: '3',
        x: 2,
        y: 2,
        size: 1,
        color: '#EE651D'
    },
    {
        id:  '4',
        label: '4',
        x: 3,
        y: 2,
        size: 1,
        color: '#EE651D'
    },
    {
        id:  't',
        label: 't',
        x: 4,
        y: 1,
        size: 1,
        color: '#EE651D'
    },
],
edges: [
    {
        id: 0, 
        source: 's', 
        target: '1',
        color: '#00FF00',
        type: 'arrow',
        size: 15,
        label: '0 / 15',
        capacity: 0,
        curr: 15,
    },
    {
        id: 1, 
        source: '1', 
        target: '2',
        color: '#00FF00',
        type: 'arrow',
        size: 12,
        label: '4 / 12',
        capacity: 4,
        curr: 12,
    },
    {
        id: 2, 
        source: '2', 
        target: 't',
        color: '#00FF00',
        type: 'arrow',
        size: 7,
        label: '4 / 7',
        capacity: 4,
        curr: 7,
    },
    {
        id: 3, 
        source: 's', 
        target: '3',
        color: '#00FF00',
        type: 'arrow',
        size: 4,
        label: '4 / 4',
        capacity: 4,
        curr: 4,
    },
    {
        id: 4, 
        source: '3', 
        target: '4',
        color: '#00FF00',
        type: 'arrow',
        size: 10,
        label: '4 / 10',
        capacity: 4,
        curr: 10,
    },
    {
        id: 5, 
        source: '4', 
        target: 't',
        color: '#00FF00',
        type: 'arrow',
        size: 10,
        label: '0 / 10',
        capacity: 10,
        curr: 0,
    },
    {
        id: 6, 
        source: '2', 
        target: '3',
        color: '#00FF00',
        type: 'arrow',
        size: 3,
        label: '0 / 3',
        capacity: 3,
        curr: 0,
    },
    {
        id: 7, 
        source: '4', 
        target: '1',
        color: '#00FF00',
        type: 'arrow',
        size: 5,
        label: '4 / 5',
        capacity: 5,
        curr: 4,
    },
],
};
s.graph.read(graph);
let dragListener = sigma.plugins.dragNodes(s, s.renderers[0]);
s.refresh();