import test from 'ava';
import { Script } from '../../src';
import { MetricsAggregationBase } from '../../src/aggregations/metrics-aggregations';
import {
    illegalParamType,
    nameTypeExpectStrategy,
    makeSetsOptionMacro
} from '../_macros';

const getInstance = field =>
    new MetricsAggregationBase('my_agg', 'my_type', field);

const setsOption = makeSetsOptionMacro(
    getInstance,
    nameTypeExpectStrategy('my_agg', 'my_type')
);

test('can be instantiated', t => {
    t.truthy(getInstance());
});

test(illegalParamType, getInstance(), 'script', 'Script');
test(setsOption, 'field', { param: 'my_field' });
test(setsOption, 'script', {
    param: new Script()
        .lang('groovy')
        .file('calculate-score')
        .params({ my_modifier: 2 })
});
test(setsOption, 'missing', { param: 1 });
test(setsOption, 'format', { param: '####.00' });

test('constructor sets field', t => {
    const valueA = getInstance('my_field').toJSON();
    const valueB = getInstance()
        .field('my_field')
        .toJSON();
    t.deepEqual(valueA, valueB);

    const expected = {
        my_agg: {
            my_type: {
                field: 'my_field'
            }
        }
    };
    t.deepEqual(valueA, expected);
});
