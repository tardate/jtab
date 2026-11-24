# jTab - Guitar Chord and Tab Library

this is the source repository for the jTab Javascript library.

See [jTab](https://jtab.tardate.com/) for more info..

## Number of strings

Tab defaults to 6 strings. Add a `strings-N` class to draw 4, 5 or 7 strings instead:

```html
<div class="jtab tabonly strings-7">$B 0 2 3 | $b 0 1 $e 0 ||</div>
```

Strings can be given by number (`$1` = highest string) or by name:

| Strings | Names (low to high) |
|---|---|
| 4 | `E A D G` |
| 5 | `B E A D G` |
| 6 | `E A D G B e` (`$b` also works for `$B`) |
| 7 | `B E A D G b e` (`$B` = low B, `$b` = high B) |

Chord diagrams are only supported for 6 strings.

## Hosting

I'm using GitHub Pages to host [jtab.tardate.com](https://jtab.tardate.com) directly from the GitHub repository.

## Contributing

1. Fork it ( <https://github.com/tardate/jtab/fork> )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
